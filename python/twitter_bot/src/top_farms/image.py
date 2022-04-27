import os

from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

from src.constants.config import PATH_ABS
from src.utils.utils import human_format, get_logo, PATH_FONTS
from src.top_farms.variations import Variation


POPPINS = ImageFont.truetype(os.path.join(PATH_FONTS, "Poppins.ttf"), size=28)
POPPINS_20 = ImageFont.truetype(os.path.join(PATH_FONTS, "Poppins.ttf"), size=20)
POPPINS_BOLD = ImageFont.truetype(os.path.join(PATH_FONTS, "Poppins-Bold.ttf"), size=28)


def get_template(variation: Variation) -> Image:
    return Image.open(os.path.join(f"{PATH_ABS}/src/top_farms/images", variation.template))


def create_image_10(farms: list[dict[str, any]], variation: Variation) -> BytesIO:
    img: Image = get_template(variation)
    draw = ImageDraw.Draw(img)

    # draw the first 3 tokens
    for i, farm in enumerate(farms[:3]):
        # paste the token logo
        logo0 = get_logo(farm["token0"], 48)
        img.paste(logo0, (100, 230 + i * 120), logo0)
        logo1 = get_logo(farm["token1"], 48)
        img.paste(logo1, (144, 230 + i * 120), logo1)

        text = f"{farm['token0'].symbol} - {farm['token1'].symbol}"
        draw.text(
            (200, 230 + i * 120),
            text,
            font=POPPINS_BOLD,
            fill=(255, 255, 255, 255)
        )
        num = farm[variation.order_by]
        text2 =  f"{num}%" if variation.order_by == "APR" else human_format(num)
        draw.text(
            (500, 230 + i * 120), 
            text2,
            font=POPPINS,
            fill=(255, 255, 255, 255)
        )

    # draw the rest of tokens
    for i, farm in enumerate(farms[3:]):
        # paste the token logo
        logo0 = get_logo(farm["token0"], 24)
        img.paste(logo0, (750, 212 + i * 50), logo0)
        logo1 = get_logo(farm["token1"], 24)
        img.paste(logo1, (770, 212 + i * 50), logo1)

        text = f"{farm['token0'].symbol} - {farm['token1'].symbol}"
        _, y = draw.textsize(text, font=POPPINS_20)
        draw.text(
            (800, (200+(y//2)) + i * 50),
            text,
            font=POPPINS_20,
            fill=(255, 255, 255, 255)
        )
        num = farm[variation.order_by]
        text2 =  f"{num}%" if variation.order_by == "APR" else human_format(num)
        _, y = draw.textsize(text2, font=POPPINS_20)
        draw.text(
            (1020, (200+(y//2)) + i * 50),
            text2,
            font=POPPINS_20,
            fill=(255, 255, 255, 255)
        )

    output = BytesIO()
    img.save(output, format="PNG")
    img.show()
    output.seek(0)
    return output

def create_image_5(farms: list[dict[str, any]], variation: Variation) -> BytesIO:
    img = get_template(variation)
    draw = ImageDraw.Draw(img)
    
    space = 80
    for i, farm in enumerate(farms):
        # compensating for misalignment of white circles
        if i > 1 and space == 80:
            space = 83
        
        logo0 = get_logo(farm["token0"], 48)
        img.paste(logo0, (550, 196 + i * space), logo0)
        logo1 = get_logo(farm["token1"], 48)
        img.paste(logo1, (594, 196 + i * space), logo1)

        text = f"{farm['token0'].symbol} - {farm['token1'].symbol}"
        _, y = draw.textsize(text, font=POPPINS_BOLD)
        draw.text(
            (655, (220-(y//2)) + i * space),
            text,
            font = POPPINS_BOLD,
            fill = (255, 255, 255, 255)
        )
        num = farm[variation.order_by]
        text2 =  f"{num}%" if variation.order_by == "APR" else human_format(num)
        _, y = draw.textsize(text2, font=POPPINS_BOLD)
        draw.text(
            (920, (220-(y//2)) + i * space),
            text2,
            font = POPPINS_BOLD,
            fill = (255, 255, 255, 255)
        )

    output = BytesIO()
    img.save(output, format="PNG")
    img.show()
    output.seek(0)
    return output


def create_image(farms: list[dict[str, any]], variation: Variation) -> BytesIO:
    if variation.number_farms == 10:
        return create_image_10(farms, variation)
    elif variation.number_farms == 5:
        return create_image_5(farms, variation)