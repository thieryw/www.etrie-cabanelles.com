import { GlTemplate } from "gitlanding/GlTemplate";
import { Header } from "./Header";
import logoIconUrl from "../assets/img/LogoIcon.png";
import instagramLogoUrl from "../assets/img/instagram.png";
import facebookLogoUrl from "../assets/img/FbIcon.png";
import { GlLogo } from "gitlanding/utils/GlLogo";
import { makeStyles } from "../theme";
import { useRoute, routes } from "../router";
import { Home } from "../pages/Home";

export function App() {
	const { classes } = useStyles();
	const route = useRoute();
	return <GlTemplate
		classes={{
			"headerWrapper": classes.header,
		}}
		headerOptions={{
			"position": "top of page",
		}}
		header={<Header
			title={<GlLogo logoUrl={logoIconUrl} width={100} height={100} />}
			breakpoint={1000}
			links={[
				{
					"label": "ACCUEIL",
					...routes.home().link
				},
				{
					"label": "ECO-LIEU"
				},
				{
					"label": "ECURIES",
					"subLinks": [
						{
							"href": "#",
							"label": "Presentation",
						},
						{
							"href": "#",
							"label": "Services"
						}
					]
				},
				{
					"label": "HEBERGEMENTS"
				},
				{
					"label": "GALERIE"
				},
				{
					"label": "CONTACT"
				},
			]}
			socialMediaIcons={[
				{
					"href": "#",
					"iconUrl": instagramLogoUrl
				},
				{
					"href": "#",
					"iconUrl": facebookLogoUrl
				}
			]}

		/>}
	>
		{
			route.name === "home" && <Home />
		}

	</GlTemplate>

}

const useStyles = makeStyles()({
	"header": {
		"overflow": "visible",
		"padding": 0,
		"position": "absolute",
		"zIndex": 4000,
		"height": "unset"


	}
})