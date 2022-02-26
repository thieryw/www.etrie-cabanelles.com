import {memo, useState} from "react";
import type { ReactNode } from "react";
import MuiLink from "@mui/material/Link";
import { breakpointsValues, makeStyles } from "../theme";
import { useDomRect } from "powerhooks/useDomRect";
import { useConstCallback } from "powerhooks/useConstCallback";

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
	const { theme, classes } = useStyles({
		"isEvenNumberOfLinks": links.length % 2 === 0
	});

	const { ref, domRect: { height: headerHeight } } = useDomRect();
	return <header ref={ref} className={classes.root}>
		<div className={classes.linkAndTitleWrapper}>
			{
				(() => {
					if (theme.windowInnerWidth < breakpointsValues.lg) {
						return <Links headerHeight={headerHeight} links={links} />
					};

					if (links.length % 2 !== 0) {
						return <>
							<div>
								{title}
							</div>
							<Links headerHeight={headerHeight} links={links} />
						</>
					}

					return <>
						<Links headerHeight={headerHeight} links={links.filter((_link, index) =>
							index < (links.length) / 2
						)
						}
						/>
						<div className={classes.titleWrapper}>
							{title}
						</div>
						<Links
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
			socialMediaIcons !== undefined && theme.windowInnerWidth < breakpointsValues.lg &&
			<div>
				{
					socialMediaIcons.map(({ href, iconUrl }) =>
						<MuiLink key={href} href={href}>
							<img src={iconUrl} alt="social media" />
						</MuiLink>
					)
				}
			</div>

		}

	</header>
})

const useStyles = makeStyles<{ isEvenNumberOfLinks: boolean }>()(
	(theme, { isEvenNumberOfLinks }) => ({
		"root": {
			"position": "relative",
			"width": theme.windowInnerWidth,
			"padding": theme.spacing(3),
			"backgroundColor": "black"

		},
		"linkAndTitleWrapper": {
			"display": "flex",
			"flexDirection": "row",
			"alignItems": "center",
			"justifyContent": "center"
		},
		"titleWrapper": {
			...(() => {
				const value = theme.spacing(7);

				return {
					"marginRight": value,
					"marginLeft": isEvenNumberOfLinks ? value : undefined
				}

			})()
		}
	}));

const { Links } = (() => {

	type LinkProps = {
		links: HeaderProps["links"];
		headerHeight: number;
	};

	const Links = memo((props: LinkProps) => {

		const { links, headerHeight } = props;

		const { classes } = useStyles();


		return <div className={classes.root}>
			{
				links.map(link => <Link headerHeight={headerHeight} link={link} />)
			}
		</div>

	});

	const useStyles = makeStyles()(
		() => ({
			"root": {
				"display": "flex"
			},

		})
	);

	return { Links };

})()

const { Link } = (() => {
	type LinkProps = {
		link: HeaderProps["links"][number];
		headerHeight: number;
	}

	const Link = memo((props: LinkProps) => {

		const { link: { label, subLinks, href, onClick }, headerHeight } = props;
		const { ref: linkRef, domRect: { height: linkHeight } } = useDomRect();
		const {ref: subLinksRef, domRect: { height: subLinksHeight}} = useDomRect();

		const [areSubLinksUnfolded, setAreSubLinksUnfolded] = useState(false);
		const toggleSubLinks = useConstCallback(()=>{
			setAreSubLinksUnfolded(!areSubLinksUnfolded);
		});

		const { classes, cx } = useStyles({
			headerHeight, linkHeight,
			areSubLinksUnfolded,
			subLinksHeight
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
						<span className={classes.downArrow}>⋁</span>
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
		</div>



	})

	const useStyles = makeStyles<{
		headerHeight: number;
		linkHeight: number;
		areSubLinksUnfolded: boolean;
		subLinksHeight: number
	}>()(
		(theme, { headerHeight, linkHeight, areSubLinksUnfolded, subLinksHeight }) => ({
			"subLinks": {
				"display": "flex",
				"flexDirection": "column",
				"paddingBottom": theme.spacing(2)
			},
			"subLink": {
				"marginBottom": theme.spacing(3)
			},
			"subLinksWrapper": {
				"transition": "height 400ms",
				"height": areSubLinksUnfolded ? subLinksHeight : 0,
				"overflow": "hidden",
				"position": "absolute",
				"top": headerHeight / 2 + linkHeight / 2,
				"left": 0,
				"backgroundColor": "black",
			},
			"downArrow": {
				"position": "relative",
				"display": "inline-block",
				"left": theme.spacing(3),
				"top": -2,
				"fontWeight": 600,
				"transition": "transform 300ms",
				"transform": `${areSubLinksUnfolded ? "rotate(0.5turn)" : undefined}`,
			},
			"link": {
				...theme.spacing.rightLeft("margin", `${theme.spacing(6)}px`),
				"color": "white",
				"textDecoration": "none",
				"fontSize": "1.2rem",
				"cursor": "pointer",
				"transition": "color 400ms",
				"letterSpacing": "0.05rem",
				"userSelect": "none",
				"&: hover": {
					"color": "gold"
				},
			},
			"linkWrapper": {
				"position": "relative"
			}

		})
	)

	return { Link }
})()