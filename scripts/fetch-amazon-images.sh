#!/bin/bash
# Fetch Amazon product images for perfumes
# Output: name|imageUrl pairs

OUTFILE="$(dirname "$0")/amazon-image-urls.txt"
> "$OUTFILE"

declare -A ASINS
# Lattafa
ASINS[Khamrah]="B0B92Y18GT"
ASINS[Asad]="B0B8TQ7YRW"
ASINS[Yara]="B09KZLG5SV"
ASINS[OudForGlory]="B0BMPD5FPN"
ASINS[Raghba]="B00R4H3B0G"
ASINS[AnaAbiyedh]="B07JM36WXS"
ASINS[QaedAlFursan]="B0B5KBRVBZ"
# Afnan
ASINS[9PM]="B09V2KX3M8"
ASINS[SupremacySilver]="B08YS6DW7S"
# Armaf
ASINS[CDNIM]="B071V7S3NX"
ASINS[Sillage]="B09QZMHVLP"
# Creed
ASINS[Aventus]="B071CYS5ZZ"
ASINS[GreenIrishTweed]="B000C1V1TA"
ASINS[Viking]="B07CJT6MRR"
ASINS[SilverMountainWater]="B000C214GG"
# MFK
ASINS[BR540]="B01B7AP3RQ"
ASINS[GrandSoir]="B01LLZWNTG"
ASINS[PetitMatin]="B01LLS2DNY"
# Tom Ford
ASINS[OudWood]="B00657AZUE"
ASINS[TobaccoVanilla]="B0040YYFL4"
ASINS[LostCherry]="B07KFCXWKM"
ASINS[BlackOrchid]="B000MG1EGQ"
# Dior
ASINS[Sauvage]="B079TQS99Q"
ASINS[MissDior]="B081TVLZBL"
ASINS[Jadore]="B000C1V7N4"
ASINS[Fahrenheit]="B000C1WXP8"
# Chanel
ASINS[BleuDeChanel]="B008FMVJM0"
ASINS[CocoMademoiselle]="B000C1WIG0"
# Versace
ASINS[Eros]="B009NA9SQI"
ASINS[DylanBlue]="B01H7JCUYI"
# YSL
ASINS[LaNuitDeLHomme]="B001FWXPZM"
ASINS[Libre]="B07WKNB67L"
# Armani
ASINS[AcquaDiGio]="B000GKNCKO"
ASINS[ArmaniCode]="B0019Y7OWW"
ASINS[Si]="B00EHYRLMK"
# DG
ASINS[TheOne]="B0023FOQSG"
ASINS[LightBlue]="B000C1WDI8"
# JPG
ASINS[LeMale]="B000C1TLSW"
# Guerlain
ASINS[Shalimar]="B000C1U6XC"
# PDM
ASINS[Layton]="B01N5IFWSP"
ASINS[Pegasus]="B0044QJXOC"
ASINS[Delina]="B073X3RQ1L"
# Initio
ASINS[OudForGreatness]="B075SXR2HQ"
ASINS[SideEffect]="B0745F1M1P"
# Xerjoff
ASINS[Naxos]="B0744K7Y6K"
ASINS[ErbaPura]="B078C1LD6K"
# Nishane
ASINS[Hacivat]="B078G8PRRT"
# Amouage
ASINS[InterludeMan]="B006WLNRXO"
ASINS[ReflectionMan]="B003R68S2U"
# Montale
ASINS[IntenseCafe]="B00BSFPQ6M"
# Mancera
ASINS[CedratBoise]="B00BGCJHC4"
ASINS[RedTobacco]="B07XS54N3W"
# Byredo
ASINS[GypsyWater]="B003TJCR1E"
ASINS[BalDAfrique]="B00HGWJNGI"
# Le Labo
ASINS[Santal33]="B00BTPWJQS"
# Maison Margiela
ASINS[ByTheFireplace]="B01M0U8HSB"
ASINS[JazzClub]="B01N3AC0AK"
# Hermes
ASINS[TerreDHermes]="B001CT081W"
# Acqua di Parma
ASINS[Colonia]="B000E7XPBK"
# Al Haramain
ASINS[AmberOudGold]="B07KF2QZZ2"
ASINS[AmberOudRouge]="B09GFNLFP5"
ASINS[LAventure]="B01NGXRP11"
# Rasasi
ASINS[LaYuqawam]="B00E1VEL8I"
ASINS[Hawas]="B01LPHYYCC"

for KEY in "${!ASINS[@]}"; do
  ASIN="${ASINS[$KEY]}"
  IMG=$(curl -sL "https://www.amazon.com/dp/$ASIN" \
    -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" \
    -H "Accept: text/html" \
    -H "Accept-Language: en-US" \
    --compressed 2>&1 | grep -oE '"hiRes":"https://m\.media-amazon\.com/images/I/[^"]+' | head -1 | sed 's/"hiRes":"//' | sed 's/_SL[0-9]*_/_SL500_/')
  if [ -n "$IMG" ]; then
    echo "$KEY|$IMG" >> "$OUTFILE"
    echo "OK: $KEY"
  else
    echo "SKIP: $KEY"
  fi
  sleep 5
done

echo "Done! Results in $OUTFILE"
cat "$OUTFILE" | wc -l
echo " images found"
