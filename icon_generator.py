#!/usr/bin/env python3

import sys
from PIL import Image
from PIL import ImageOps


def usage():
    print('usage: ./icon_generator.py <src_image>')


def main(filename):
    icon_sizes = (16, 19, 32, 38, 48, 128)
    src_image = Image.open(filename, 'r')

    for size in icon_sizes:
        icon = src_image.resize((size, size), Image.LANCZOS)
        icon.save('extension/icons/icon{size}.png'.format(size=size))
        if size == 19:
            grayscale_icon = ImageOps.grayscale(icon)
            grayscale_icon.save('extension/icons/icon{size}-disable.png'.format(size=size))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        usage()
        sys.exit(1)

    filename = sys.argv[1]
    main(filename)