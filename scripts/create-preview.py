"""Generate the bundled, generic social card using Pillow (optional, not part of build)."""
from PIL import Image, ImageDraw, ImageFont
im = Image.new('RGB', (1200, 630), '#f8f3e9')
d = ImageDraw.Draw(im)
font_path = '/System/Library/Fonts/Supplemental/Georgia.ttf'
try:
    title = ImageFont.truetype(font_path, 75)
    small = ImageFont.truetype(font_path, 25)
except OSError:
    title = ImageFont.load_default(size=75)
    small = ImageFont.load_default(size=25)
d.rectangle((25,25,1175,605), outline='#d9c4b5', width=2)
d.text((600,120), 'Our little love story.', font=title, fill='#513f39', anchor='mm')
d.text((600,195), 'A little book of us. Made with love.', font=small, fill='#9b4b59', anchor='mm')
d.rounded_rectangle((420,285,780,505), radius=5, fill='#e5beb5')
d.polygon([(420,285),(600,425),(780,285)], fill='#d3aaa4')
d.polygon([(420,505),(600,375),(780,505)], fill='#eed6cc')
d.ellipse((574,380,626,432),fill='#9b4b59')
d.line([(590,400),(600,413),(610,400)],fill='#f8f3e9',width=3)
im.save('public/images/decorations/preview.png', optimize=True)
