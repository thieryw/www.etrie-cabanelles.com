import { createThemeProvider, defaultGetTypographyDesc } from "onyxia-ui";
import { createMakeStyles } from "tss-react";
import { createText } from "onyxia-ui/Text";
import { defaultPalette } from "onyxia-ui/lib/color"
import  { breakpointsValues as onyxiaBreakpointValues } from "onyxia-ui"

export const breakpointsValues = {
    ...onyxiaBreakpointValues,
    "lg": 1280,
    "lg+": 1440
}

export const { ThemeProvider, useTheme } = createThemeProvider({
    "getTypographyDesc": ({
        browserFontSizeFactor,
        windowInnerHeight,
        windowInnerWidth,
    }) => {
        const typographyDesc = defaultGetTypographyDesc({
            browserFontSizeFactor,
            windowInnerHeight,
            windowInnerWidth,
        });

        return {
            "fontFamily": '"futura", sans-serif',
            "rootFontSizePx": typographyDesc.rootFontSizePx,
            "variants": {
                ...typographyDesc.variants,
                "display heading": {
                    "fontFamily": '"rilistered", sans-serif',
                    "fontSizeRem": 6,
                    "htmlComponent": "h1",
                    "fontWeight": "normal",
                    "lineHeightRem": 6
                },
                "pageHeading": {
                    "fontFamily": '"freight", sans-serif',
                    "fontSizeRem": 2,
                    "htmlComponent": "h2",
                    "fontWeight": "normal",
                    "lineHeightRem": 2

                }
            },
        };
    },
    "palette": {
        ...defaultPalette,
        "gold": "#cab679"
    }
});

export const { makeStyles } = createMakeStyles({ useTheme });
export const { Text } = createText({ useTheme });