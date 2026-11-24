/**
 * Pure-JS GIF89a binary encoder (256-color quantization + LZW compression).
 * Zero external dependencies; works cleanly over file:// and http://.
 */
(function (global) {
  'use strict';

  function buildPaletteAndIndices(rgba, width, height) {
    const pixelCount = width * height;
    const indices = new Uint8Array(pixelCount);
    // Reserve index 0 for transparency when alpha < 128; indices 1..255 use 6x7x6 color cube (252) + greys
    const palette = new Uint8Array(256 * 3);
    // Index 0: white fallback RGB
    palette[0] = 255; palette[1] = 255; palette[2] = 255;
    let pIdx = 1;
    // 6 x 7 x 6 RGB cube = 252 colors (indices 1..252)
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 7; g++) {
        for (let b = 0; b < 6; b++) {
          palette[pIdx * 3] = Math.round((r * 255) / 5);
          palette[pIdx * 3 + 1] = Math.round((g * 255) / 6);
          palette[pIdx * 3 + 2] = Math.round((b * 255) / 5);
          pIdx++;
        }
      }
    }
    // Fill remaining 3 slots (253..255) with crisp brand/mid tones
    const extras = [[247, 249, 252], [32, 46, 84], [105, 188, 252]];
    for (let e = 0; e < extras.length && pIdx < 256; e++, pIdx++) {
      palette[pIdx * 3] = extras[e][0];
      palette[pIdx * 3 + 1] = extras[e][1];
      palette[pIdx * 3 + 2] = extras[e][2];
    }

    let hasTransparency = false;
    for (let i = 0; i < pixelCount; i++) {
      const o = i * 4;
      if (rgba[o + 3] < 128) {
        indices[i] = 0;
        hasTransparency = true;
      } else {
        const r = Math.round((rgba[o] / 255) * 5);
        const g = Math.round((rgba[o + 1] / 255) * 6);
        const b = Math.round((rgba[o + 2] / 255) * 5);
        indices[i] = 1 + r * 42 + g * 6 + b;
      }
    }
    return { palette, indices, hasTransparency };
  }

  function lzwEncode(indices, minCodeSize) {
    const clearCode = 1 << minCodeSize;
    const eofCode = clearCode + 1;
    const bytes = [];
    let curByte = 0;
    let curBits = 0;

    function writeBits(code, nBits) {
      curByte |= code << curBits;
      curBits += nBits;
      while (curBits >= 8) {
        bytes.push(curByte & 0xff);
        curByte >>= 8;
        curBits -= 8;
      }
    }

    let codeSize = minCodeSize + 1;
    let nextCode = eofCode + 1;
    let table = new Map();

    function resetTable() {
      table = new Map();
      codeSize = minCodeSize + 1;
      nextCode = eofCode + 1;
    }

    writeBits(clearCode, codeSize);
    let prefix = indices[0];

    for (let i = 1; i < indices.length; i++) {
      const k = indices[i];
      const key = (prefix << 8) | k;
      const found = table.get(key);
      if (found !== undefined) {
        prefix = found;
      } else {
        writeBits(prefix, codeSize);
        if (nextCode < 4096) {
          table.set(key, nextCode);
          if (nextCode === 1 << codeSize && codeSize < 12) codeSize++;
          nextCode++;
        } else {
          writeBits(clearCode, codeSize);
          resetTable();
        }
        prefix = k;
      }
    }

    writeBits(prefix, codeSize);
    writeBits(eofCode, codeSize);
    if (curBits > 0) bytes.push(curByte & 0xff);
    return bytes;
  }

  function encodeGif(frames, width, height, delayCs) {
    const out = [];
    const pushStr = (s) => { for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i)); };
    const push16 = (v) => { out.push(v & 0xff, (v >> 8) & 0xff); };

    // Header + Logical Screen Descriptor
    pushStr('GIF89a');
    push16(width);
    push16(height);
    // Global Color Table Flag=0 (per-frame LCT handles custom colors cleanly), 8-bit color
    out.push(0x70, 0x00, 0x00);

    // Netscape 2.0 Application Extension for infinite looping
    out.push(0x21, 0xff, 0x0b);
    pushStr('NETSCAPE2.0');
    out.push(0x03, 0x01, 0x00, 0x00, 0x00);

    for (let f = 0; f < frames.length; f++) {
      const { palette, indices, hasTransparency } = buildPaletteAndIndices(frames[f], width, height);

      // Graphic Control Extension (Disposal = 2: restore to background so transparent frames never smear)
      out.push(0x21, 0xf9, 0x04);
      out.push(hasTransparency ? 0x09 : 0x08);
      push16(delayCs);
      out.push(0x00, 0x00);

      // Image Descriptor with Local Color Table (256 colors -> 2^(7+1))
      out.push(0x2c);
      push16(0); push16(0);
      push16(width); push16(height);
      out.push(0x87);

      for (let i = 0; i < palette.length; i++) out.push(palette[i]);

      const minCodeSize = 8;
      out.push(minCodeSize);
      const lzw = lzwEncode(indices, minCodeSize);
      for (let i = 0; i < lzw.length; i += 255) {
        const chunk = lzw.slice(i, i + 255);
        out.push(chunk.length);
        for (let j = 0; j < chunk.length; j++) out.push(chunk[j]);
      }
      out.push(0x00);
    }

    out.push(0x3b); // GIF Trailer
    return new Blob([new Uint8Array(out)], { type: 'image/gif' });
  }

  global.PeroGifEncoder = { encodeGif };
})(window);
