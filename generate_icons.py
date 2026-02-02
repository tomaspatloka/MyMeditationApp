#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate placeholder PWA icons
Requires: Pillow (pip install pillow)
"""

import sys

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("ERROR: Pillow not installed")
    print("Install with: pip install pillow")
    exit(1)

def create_icon(size, filename, maskable=False):
    """Create a gradient icon with a circle"""
    # Create image
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)

    # Draw gradient background
    for y in range(size):
        r = int(102 + (118 - 102) * y / size)
        g = int(126 + (75 - 126) * y / size)
        b = int(234 + (162 - 234) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    # Draw circle
    if maskable:
        # Smaller circle with padding for maskable icon
        margin = size // 6
        circle_size = size - 2 * margin
    else:
        margin = size // 4
        circle_size = size - 2 * margin

    draw.ellipse(
        [margin, margin, margin + circle_size, margin + circle_size],
        fill=(255, 255, 255, 50),
        outline=(255, 255, 255, 100),
        width=2
    )

    # Save
    img.save(f'icons/{filename}', 'PNG')
    print(f"✓ Created {filename}")

def main():
    """Generate all required icons"""
    print("Generating PWA icons...")
    print()

    sizes = [
        (72, 'icon-72.png'),
        (128, 'icon-128.png'),
        (192, 'icon-192.png'),
        (512, 'icon-512.png'),
    ]

    for size, filename in sizes:
        create_icon(size, filename)

    # Maskable icon
    create_icon(512, 'icon-maskable.png', maskable=True)

    print()
    print("✅ All icons generated successfully!")
    print()
    print("Icons saved to: icons/")
    print("You can now use the application.")

if __name__ == '__main__':
    main()
