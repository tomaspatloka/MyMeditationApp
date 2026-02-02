#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check if all required files exist for the Meditation PWA
"""

import os
import sys
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_file(filepath, required=True):
    """Check if file exists"""
    exists = Path(filepath).exists()
    status = "✓" if exists else ("✗ MISSING" if required else "○ optional")
    print(f"  {status} {filepath}")
    return exists

def main():
    print("Checking Meditation PWA files...\n")

    # Core files
    print("Core Files:")
    core = [
        "index.html",
        "manifest.json",
        "sw.js",
        "_headers",
        "README.md",
    ]
    core_ok = all(check_file(f) for f in core)

    # CSS files
    print("\nCSS Files:")
    css = [
        "css/styles.css",
        "css/timer.css",
        "css/breathing.css",
    ]
    css_ok = all(check_file(f) for f in css)

    # JavaScript files
    print("\nJavaScript Files:")
    js = [
        "js/app.js",
        "js/timer.js",
        "js/audio.js",
        "js/breathing.js",
        "js/storage.js",
        "js/i18n.js",
    ]
    js_ok = all(check_file(f) for f in js)

    # Locale files
    print("\nLocale Files:")
    locales = [
        "locales/cs.json",
        "locales/en.json",
    ]
    locales_ok = all(check_file(f) for f in locales)

    # Icon files (not required, can be generated)
    print("\nIcon Files (optional - can be generated):")
    icons = [
        "icons/icon-72.png",
        "icons/icon-128.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/icon-maskable.png",
    ]
    icons_exist = [check_file(f, required=False) for f in icons]
    icons_ok = any(icons_exist)

    # Summary
    print("\n" + "="*50)
    if core_ok and css_ok and js_ok and locales_ok:
        print("✅ All required files present!")
        if not icons_ok:
            print("\n⚠️  Icons missing - run: python generate_icons.py")
        else:
            print("✅ Icons present - ready to go!")
    else:
        print("❌ Some required files are missing")
        print("\nPlease check the files marked with ✗ above")

    print("="*50)

if __name__ == '__main__':
    main()
