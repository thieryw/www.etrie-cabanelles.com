import {memo, useState, useEffect} from "react";
import type { ReactNode } from "react";
import MuiLink from "@mui/material/Link";
import { makeStyles } from "../theme";
import { useDomRect } from "powerhooks/useDomRect";
import { useConstCallback } from "powerhooks/useConstCallback";
import { GlArrow } from "gitlanding/utils/GlArrow";
import Dehaze from "@mui/icons-material/Dehaze";
import { GlLogo } from "gitlanding/utils/GlLogo";
import CloseIcon from '@mui/icons-material/Close';


export type HeaderProps = {
	className?: string;
	links: {
		label: string;
		href?: string;
		onClick?: () => void;
		subLinks?: {
			label: string;
			href: string;
			onClick?: () => void;
		}[]
	}[];
	title?: ReactNode;
	socialMediaIcons?: {
		iconUrl: string;
		href: string;
	}[];


}

export const Header = memo((props: HeaderProps) => {
	const { links, socialMediaIcons, title } = props;
	const [isMenuUnfolded, setIsMenuUnfolded] = useState(false);
	const [breakPoint, setBreakPoint] = useState(0);
	const toggleMenu = useConstCallback(() => {
		setIsMenuUnfolded(!isMenuUnfolded);
	});
	const { ref, domRect: { height: headerHeight } } = useDomRect();
	const {ref: linksRef, domRect: { height: linksHeight, width: linksWidth }} = useDomRect();

	useEffect(()=>{
		if(breakPoint !== 0){
			return;
		}

		setBreakPoint(linksWidth);

	}, [linksWidth, breakPoint]);

	const { theme, classes } = useStyles({
		"isEvenNumberOfLinks": links.length % 2 === 0,
		isMenuUnfolded,
		linksHeight,
		breakPoint

	});
	return <div className={classes.outerWrapper}>
		{
			theme.windowInnerWidth < breakPoint &&
			<div className={classes.closeButton} onClick={toggleMenu}>
				<Dehaze />
			</div>
		}
		<header ref={ref} className={classes.root}>
			<div className={classes.innerWrapper}>
				{
					theme.windowInnerWidth < breakPoint &&
					<div className={classes.closeButton} onClick={toggleMenu}>
						<CloseIcon />
					</div>

				}
				<div ref={linksRef} className={classes.linkAndTitleWrapper}>
					{
						(() => {
							if (theme.windowInnerWidth < breakPoint) {
								return <Links breakPoint={breakPoint} headerHeight={headerHeight} links={links} />
							};

							if (links.length % 2 !== 0) {
								return <>
									<div>
										{title}
									</div>
									<Links breakPoint={breakPoint} headerHeight={headerHeight} links={links} />
								</>
							}

							return <>
								<Links breakPoint={breakPoint} headerHeight={headerHeight} links={links.filter((_link, index) =>
									index < (links.length) / 2
								)
								}
								/>
								<div className={classes.titleWrapper}>
									{title}
								</div>
								<Links
									breakPoint={breakPoint}
									headerHeight={headerHeight}
									links={links.filter((_link, index) =>
										index >= (links.length) / 2
									)
									}
								/>
							</>
						})()
					}
				</div>

				{
					socialMediaIcons !== undefined && theme.windowInnerWidth < breakPoint &&
					<div className={classes.socialMediaIcons}>
						{
							socialMediaIcons.map(({ href, iconUrl }) =>
								<MuiLink className={classes.socialMediaIcon} key={href} href={href}>
									<GlLogo logoUrl={iconUrl} width={theme.spacing(7)} />
								</MuiLink>
							)
						}
					</div>

				}

			</div>

		</header>
	</div>
})

const useStyles = makeStyles<{
	isEvenNumberOfLinks: boolean;
	isMenuUnfolded: boolean;
	linksHeight: number;
	breakPoint: number;
}>()(
	(theme, { isEvenNumberOfLinks, isMenuUnfolded, linksHeight, breakPoint }) => {
		return {
			"root": {
				"position": "absolute",
				"width": theme.windowInnerWidth,
				"top": 0,
				"left": 0,
				"height": linksHeight + theme.spacing(3) * 2,
				"backgroundColor": "black",
				"opacity": breakPoint === 0 ? 0 : 1,
				...(theme.windowInnerWidth < breakPoint ? {
					"height": isMenuUnfolded ? "100vh" : 0,
					"transition": breakPoint === 0 ? "none" : "height 400ms",
					"overflow": "hidden"
				} : {})

			},
			"closeButton": {
				"position": "absolute",
				"top": theme.spacing(5),
				"right": theme.spacing(5),
				"transform": "scale(1.4)"

			},
			"outerWrapper": {
				"width": "100vw"
			},
			"innerWrapper": {
				"padding": theme.spacing(3),
				"display": "flex",
				"justifyContent": "center",
				...(theme.windowInnerWidth < breakPoint ? {
					"flexDirection": "column",
					"height": "100%",
					"paddingTop": theme.spacing(8)
				} : {})
			},
			"linkAndTitleWrapper": {
				"position": theme.windowInnerWidth < breakPoint ? "relative" : "absolute",
				"display": "flex",
				"flexDirection": "row",
				"alignItems": "center",
				"justifyContent": "center",
				...(theme.windowInnerWidth < breakPoint ? {
					"justifyContent": "left",

				} : {})
			},
			"titleWrapper": {
				...(() => {
					const value = theme.spacing(7);

					return {
						"marginRight": value,
						"marginLeft": isEvenNumberOfLinks ? value : undefined
					}

				})()
			},
			"socialMediaIcons": {
				"display": "flex",
				"justifyContent": "center"
			},
			"socialMediaIcon": {
				"margin": theme.spacing(3)

			}

		}
	});

const { Links } = (() => {

	type LinkProps = {
		links: HeaderProps["links"];
		headerHeight: number;
		breakPoint: number;
	};

	const Links = memo((props: LinkProps) => {

		const { links, headerHeight, breakPoint } = props;

		const { classes } = useStyles({
			breakPoint
		});


		return <div className={classes.root}>
			{
				links.map(link => <Link breakPoint={breakPoint} headerHeight={headerHeight} link={link} />)
			}
		</div>

	});

	const useStyles = makeStyles<{ breakPoint: number }>()(
		(theme, { breakPoint }) => ({
			"root": {
				"display": "flex",
				...(theme.windowInnerWidth < breakPoint ? {
					"flexDirection": "column",
					"position": "relative",
					"left": theme.spacing(6),

				} : {

				})
			},

		})
	);

	return { Links };

})()

const { Link } = (() => {
	type LinkProps = {
		link: HeaderProps["links"][number];
		headerHeight: number;
		breakPoint: number;
	}

	const Link = memo((props: LinkProps) => {

		const { link: { label, subLinks, href, onClick }, headerHeight, breakPoint } = props;
		const { ref: linkRef, domRect: { height: linkHeight } } = useDomRect();
		const { ref: subLinksRef, domRect: { height: subLinksHeight } } = useDomRect();

		const [areSubLinksUnfolded, setAreSubLinksUnfolded] = useState(false);
		const toggleSubLinks = useConstCallback(() => {
			setAreSubLinksUnfolded(!areSubLinksUnfolded);
		});

		const { classes, cx, theme } = useStyles({
			headerHeight, linkHeight,
			areSubLinksUnfolded,
			subLinksHeight,
			breakPoint
		});

		return <div
			ref={subLinks !== undefined ? linkRef : undefined}
			className={classes.linkWrapper}
			key={label}
		>
			<MuiLink
				onClick={subLinks !== undefined ? toggleSubLinks : onClick}
				href={subLinks !== undefined ? href : undefined}
				className={classes.link}
			>
				{label}
				{
					subLinks !== undefined &&
					<GlArrow className={classes.downArrow} direction="down" />
				}
			</MuiLink>
			{

				subLinks !== undefined &&
				<div className={classes.subLinksWrapper}>
					<div ref={subLinksRef} className={classes.subLinks}>
						{
							subLinks.map(({ label, ...rest }) =>
								<MuiLink className={cx(classes.link, classes.subLink)} key={label} {...rest}>{label}</MuiLink>
							)
						}
					</div>
				</div>
			}
			{
				theme.windowInnerWidth < breakPoint &&
				<div className={classes.underline}></div>
			}
		</div>



	})

	const useStyles = makeStyles<{
		headerHeight: number;
		linkHeight: number;
		areSubLinksUnfolded: boolean;
		subLinksHeight: number;
		breakPoint: number;
	}>()(
		(theme, { headerHeight, linkHeight, areSubLinksUnfolded, subLinksHeight, breakPoint }) => ({
			"subLinks": {
				"display": "flex",
				"flexDirection": "column",
				"paddingBottom": theme.spacing(2)
			},
			"subLink": {
				...(theme.windowInnerWidth >= breakPoint ? {
					"marginBottom": theme.spacing(3),
				} : {
					"marginTop": theme.spacing(4)
				})
			},
			"subLinksWrapper": {
				"transition": "height 400ms",
				"height": areSubLinksUnfolded ? subLinksHeight : 0,
				"overflow": "hidden",
				...(theme.windowInnerWidth >= breakPoint ? {
					"position": "absolute",
					"top": headerHeight / 2 + linkHeight / 2,

				} : {}),
				"left": 0,
				"backgroundColor": "black",
			},
			"downArrow": {
				"transition": "transform 300ms",
				"transform": `${areSubLinksUnfolded ? "rotate(0.5turn)" : undefined}`,
				"height": "10px",
				"position": "relative",
				"left": theme.spacing(2)
			},
			"link": {
				"whiteSpace": "nowrap",
				...(theme.windowInnerWidth >= breakPoint ? {
					...theme.spacing.rightLeft("margin", `${theme.spacing(6)}px`),
				} : {}),
				"color": "white",
				"position": "relative",
				"display": "flex",
				"alignItems": "center",
				"textDecoration": "none",
				"fontSize": "1.2rem",
				"cursor": "pointer",
				"transition": "color 400ms",
				"letterSpacing": "0.05rem",
				"userSelect": "none",
				"&: hover": {
					"color": theme.colors.palette.gold
				},
			},
			"linkWrapper": {
				"position": "relative",
				...(theme.windowInnerWidth < breakPoint ? {
					"marginBottom": theme.spacing(7)
				} : {})

			},
			"underline": {
				"maxWidth": 400,
				"height": 1,
				"backgroundColor": "white",
				"position": "relative",
				"top": theme.spacing(4)

			}

		})
	)

	return { Link }
})()