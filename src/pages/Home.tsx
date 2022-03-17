import { memo } from "react";
import { ImageSliderBackground } from "../components/ImageSliderBackground";
import { makeStyles } from "../theme";
import slide1 from "../assets/img/home/Slide1.jpg";
import slide2 from "../assets/img/home/Slide2.jpg";
import slide3 from "../assets/img/home/Slide3.jpg";
import { useTheme } from "gitlanding/theme";

export const Home = memo(() => {
	const { paddingRightLeft } = useTheme();
	const { classes } = useStyles({paddingRightLeft});
	return <section>
		<div className={classes.sliderBackground}>
			<ImageSliderBackground
				imageUrls={[
					slide1,
					slide2,
					slide3,
				]}
			/>

		</div>

	</section>
})

const useStyles = makeStyles<{paddingRightLeft: number}>()(
	(...[,{paddingRightLeft}]) => ({
		"sliderBackground": {
			"position": "relative",
			"left": -paddingRightLeft,
			"width": window.innerWidth,
			"height": window.innerHeight,
		}

	})
)