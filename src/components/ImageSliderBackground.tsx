import { memo, useState, useEffect } from "react";
import { makeStyles } from "../theme";


export type ImageSliderBackgroundProps = {
	imageUrls: string[];
	timeBetweenSlides?: number;
	fadeDuration?: number;
};

export const ImageSliderBackground = memo((props: ImageSliderBackgroundProps) => {
	const { imageUrls, timeBetweenSlides, fadeDuration } = props;
	const { classes } = useStyles();
	const [imageShownIndex, setImageShownIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setImageShownIndex(imageShownIndex === imageUrls.length - 1 ? 0 : imageShownIndex + 1);

		}, timeBetweenSlides ?? 9000);
		return () => clearInterval(interval);

	}, [timeBetweenSlides, imageShownIndex, imageUrls])

	return <div className={classes.root}>
		{
			imageUrls.map((url, index) => <Image 
				imageUrl={url} 
				isShown={imageShownIndex === index} 
				fadeDuration={(()=>{
					if(timeBetweenSlides === undefined){
						if(fadeDuration === undefined){
							return 2000;
						}

						return fadeDuration > 9000 ? 9000 : fadeDuration;
					}
					if(fadeDuration === undefined){
						return timeBetweenSlides < 2000 ? timeBetweenSlides : 2000
					}
					return timeBetweenSlides < fadeDuration ? timeBetweenSlides : fadeDuration
				})()}
			/>)
		}

	</div>

});

const useStyles = makeStyles()(
	() => ({
		"root": {
			"position": "absolute",
			"top": 0,
			"left": 0,
			"width": "100%",
			"height": "100%",
			"overflow": "hidden"
		}

	})
)

const { Image } = (() => {
	type ImageProps = {
		imageUrl: string;
		isShown: boolean;
		fadeDuration: number;
	};

	const Image = memo((props: ImageProps) => {

		const { imageUrl, isShown, fadeDuration } = props;

		const { classes } = useStyles({
			isShown,
			fadeDuration
		})


		return <img className={classes.root} src={imageUrl} alt="background" />

	});

	const useStyles = makeStyles<Pick<ImageProps, "fadeDuration" | "isShown">>()(
		(...[, { isShown, fadeDuration }]) => ({
			"root": {
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"height": "100%",
				"transition": `opacity ${fadeDuration}ms`,
				"opacity": isShown ? 1 : 0,
				"objectFit": "cover",
				"verticalAlign": "middle"

			}

		})
	)

	return { Image }
})()