import {memo, useState, useMemo, useEffect} from "react";
import type { ReactNode } from "react";
import MuiLink from "@mui/material/Link";
import { makeStyles } from "../theme";
import { useDomRect } from "powerhooks/useDomRect";
import { useConstCallback } from "powerhooks/useConstCallback";
import { GlArrow } from "gitlanding/utils/GlArrow";
import Dehaze from "@mui/icons-material/Dehaze";
import { GlLogo } from "gitlanding/utils/GlLogo";
import CloseIcon from '@mui/icons-material/Close';
import { breakpointsValues } from "../theme";


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
	breakpoint?: number;


}

const transitionTime = 400;

export const Header = memo((props: HeaderProps) => {
	const { links, socialMediaIcons, title } = props;
	const [isMenuUnfolded, setIsMenuUnfolded] = useState(false);
	const [isMenuUnfoldedTrans, setIsMenuUnfoldedTrans] = useState(false);
	const toggleMenu = useConstCallback(async () => {
		setIsMenuUnfolded(!isMenuUnfolded);
		await new Promise<void>(resolve=> setTimeout(resolve, transitionTime));
		setIsMenuUnfoldedTrans(!isMenuUnfoldedTrans);
	});
	const { ref, domRect: { height: headerHeight } } = useDomRect();

	const [linkAndSocialFixedHeight, setLinkAndSocialFixedHeight] = useState(0);



	const breakpoint = useMemo(() => {
		return props.breakpoint ?? breakpointsValues.md
	}, [props.breakpoint])


	const { theme, classes, cx } = useStyles({
		"isEvenNumberOfLinks": links.length % 2 === 0,
		isMenuUnfolded,
		breakpoint,
		"linkAndSocialHeight": linkAndSocialFixedHeight,
		isMenuUnfoldedTrans,
	});

	const { ref: linkAndSocialRef, domRect: { height: linkAndSocialHeight } } = useDomRect();

	useEffect(()=>{
			if(
				theme.windowInnerWidth >= breakpoint ||
				isMenuUnfolded
			){
				return;
			}
		  setLinkAndSocialFixedHeight(linkAndSocialHeight);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		linkAndSocialHeight,
		breakpoint,
	]);

	return <div className={classes.outerWrapper}>
		{
			theme.windowInnerWidth < breakpoint &&
			<div className={classes.toggleButton} onClick={toggleMenu}>
				<Dehaze />
			</div>
		}
		<header ref={ref} className={classes.root}>
			<div className={classes.innerWrapper}>
				{
					theme.windowInnerWidth < breakpoint &&
					<div className={cx(classes.toggleButton, classes.closeButton)} onClick={toggleMenu}>
						<CloseIcon />
					</div>

				}
				<div ref={linkAndSocialRef} className={classes.linkAndSocialWrapper}>
					<div className={classes.linkAndTitleWrapper}>
						{
							(() => {
								if (theme.windowInnerWidth < breakpoint) {
									return <Links breakPoint={breakpoint} headerHeight={headerHeight} links={links} />
								};

								if (links.length % 2 !== 0) {
									return <>
										<div>
											{title}
										</div>
										<Links breakPoint={breakpoint} headerHeight={headerHeight} links={links} />
									</>
								}

								return <>
									<Links breakPoint={breakpoint} headerHeight={headerHeight} links={links.filter((_link, index) =>
										index < (links.length) / 2
									)
									}
									/>
									<div className={classes.titleWrapper}>
										{title}
									</div>
									<Links
										breakPoint={breakpoint}
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
						socialMediaIcons !== undefined && theme.windowInnerWidth < breakpoint &&
						<div className={classes.socialMediaIcons}>
							{
								socialMediaIcons.map(({ href, iconUrl }) =>
									<MuiLink className={classes.socialMediaIcon} key={href} href={href}>
										<GlLogo logoUrl={iconUrl} width={theme.spacing(6) + theme.spacing(2)} />
									</MuiLink>
								)
							}
						</div>
					}
				</div>
			</div>
		</header>
	</div>
})

const useStyles = makeStyles<{
	isEvenNumberOfLinks: boolean;
	isMenuUnfolded: boolean;
	breakpoint: number;
	linkAndSocialHeight: number;
	isMenuUnfoldedTrans: boolean;
}>()(
	(theme, {
		isEvenNumberOfLinks,
		isMenuUnfolded,
		breakpoint,
		linkAndSocialHeight,
		isMenuUnfoldedTrans,
	}) => {
		return {
			"root": {
				"position": "relative",
				"width": theme.windowInnerWidth,
				"top": 0,
				"left": 0,
				"backgroundColor": "black",
				...(theme.windowInnerWidth < breakpoint ? {
					"height": isMenuUnfolded ? window.innerHeight : 0,
					"transition": `height ${transitionTime}ms`,
					"overflow": "hidden"
				} : {})

			},
			"toggleButton": {
				"position": "absolute",
				...(() => {
					const value = theme.spacing(6) + theme.spacing(4);

					return {
						"top": value,
						"right": value
					}

				})(),
				"transform": "scale(1.4)"
			},
			"closeButton": {
				"transition": "opacity 200ms",
				"opacity": isMenuUnfolded ? 1 : 0,
				"pointerEvents": isMenuUnfolded ? undefined : "none",
				"zIndex": 4

			},
			"outerWrapper": {
				"width": "100vw"
			},
			"innerWrapper": {
				"padding": theme.spacing(3),
				"display": "flex",
				...(theme.windowInnerWidth < breakpoint ? {
					"flexDirection": "column",
					"height": "100%",
					"overflow": isMenuUnfoldedTrans && isMenuUnfolded ? "auto" : "hidden"
				} : {
					"justifyContent": "center",
				})
			},
			"linkAndTitleWrapper": {
				"display": "flex",
				"flexDirection": "row",
				"alignItems": "center",
				"justifyContent": "center",
				...(theme.windowInnerWidth < breakpoint ? {
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
			"linkAndSocialWrapper": {
				...(theme.windowInnerWidth < breakpoint ? {
					"position": "relative",
					"top": (() => {
						if (linkAndSocialHeight >= window.innerHeight - theme.spacing(8)) {
							return theme.spacing(8);
						}
						return window.innerHeight / 2 - linkAndSocialHeight / 2;

					})(),

				} : {})
			},
			"socialMediaIcons": {
				"display": "flex",
				"justifyContent": "center",
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
			breakpoint: breakPoint
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
		breakpoint: number;
	}>()(
		(theme, { headerHeight, linkHeight, areSubLinksUnfolded, subLinksHeight, breakpoint }) => ({
			"subLinks": {
				"display": "flex",
				"flexDirection": "column",
				"paddingBottom": theme.spacing(2)
			},
			"subLink": {
				...(theme.windowInnerWidth >= breakpoint ? {
					"marginBottom": theme.spacing(3),
				} : {
					"marginTop": theme.spacing(4)
				})
			},
			"subLinksWrapper": {
				"transition": `height ${transitionTime}ms`,
				"height": areSubLinksUnfolded ? subLinksHeight : 0,
				"overflow": "hidden",
				...(theme.windowInnerWidth >= breakpoint ? {
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
				...(() => {
					const getSpacing = (breakpointValue: number) => {
						return theme.spacing.rightLeft("margin", `${theme.spacing(breakpointValue)}px`)
					};
					if (theme.windowInnerWidth >= breakpointsValues["lg+"]) {
						return {
							...getSpacing(6)
						};
					};

					if (theme.windowInnerWidth >= breakpointsValues["lg"]) {
						return {
							...getSpacing(5)
						};
					}

					if (breakpoint < breakpointsValues["lg"] && theme.windowInnerWidth >= breakpoint) {
						return {
							...getSpacing(4)
						};
					};

					return {};

				})(),
				"color": "white",
				"position": "relative",
				"display": "flex",
				"alignItems": "center",
				"textDecoration": "none",
				"fontSize": "1.2rem",
				"cursor": "pointer",
				"transition": `color ${transitionTime}ms`,
				"letterSpacing": "0.05rem",
				"userSelect": "none",
				"&: hover": {
					"color": theme.colors.palette.gold
				},
			},
			"linkWrapper": {
				"position": "relative",
				...(theme.windowInnerWidth < breakpoint ? {
					"marginBottom": theme.spacing(7)
				} : {})

			},
			"underline": {
				"maxWidth": 400,
				"height": 1,
				"backgroundColor": "grey",
				"position": "relative",
				"top": theme.spacing(4)

			}

		})
	)

	return { Link }
})()