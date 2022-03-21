import { memo } from "react";
import { ImageSliderBackground } from "../components/ImageSliderBackground";
import { makeStyles } from "../theme";
import slide1 from "../assets/img/home/Slide1.jpg";
import slide2 from "../assets/img/home/Slide2.jpg";
import slide3 from "../assets/img/home/Slide3.jpg";
import { useTheme } from "gitlanding/theme";
import { Slider } from "../components/Slider";

export const Home = memo(() => {
	const { paddingRightLeft } = useTheme();
	const { classes } = useStyles({ paddingRightLeft });
	return <div>
		<section className={classes.sliderBackground}>
			<ImageSliderBackground
				imageUrls={[
					slide1,
					slide2,
					slide3,
				]}
			/>

		</section>

		<section style={{
			"display": "flex",
			"alignItems": "center",
			"justifyContent": "center"
		}}>
			<Slider 
			 className={classes.slider}
				slides={[
					<img src={slide1} alt="slide"/>,
					<img src={slide2} alt="slide"/>,
					<img src={slide3} alt="slide"/>
				]}
			/>
		</section>


	</div>
})

const useStyles = makeStyles<{ paddingRightLeft: number }>()(
	(...[, { paddingRightLeft }]) => ({
		"sliderBackground": {
			"position": "relative",
			"left": -paddingRightLeft,
			"width": window.innerWidth,
			"height": window.innerHeight,
		},
		"slider": {
			"width": "1200px",
			"& img": {
				"width": "100%",
				"objectFit": "cover",
				"height": "100%",

			}
		}

	})
)