import { memo, useState } from "react";
import type { ReactNode } from "react";
import { makeStyles } from "../theme";
import { useDomRect } from "powerhooks/useDomRect";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";


export type SliderProps = {
	slides: ReactNode[];
	className?: string;
}

export const Slider = memo((props: SliderProps) => {
	const { slides, className } = props;
	const {ref, domRect: {width}} = useDomRect();
	const [transform, setTransform] = useState(0);

	/*const next = useConstCallback(()=>{
		if(transform === width * (slides.length - 1)){
			setTransform(0);
			return;
		}

		setTransform(transform + width);
	})*/
	const slide = useCallbackFactory((
		[direction]: ["left" | "right"]
	)=>{
		const sliderLength = width * (slides.length - 1);
		switch(direction) {
			case "left": (()=>{
				if(-transform === sliderLength){
					setTransform(0);
					return ;
				}

				setTransform(transform - width);


			})(); return;
			case "right": (()=>{
				if(transform === 0){
					setTransform(-sliderLength);
					return;
				}

				setTransform(transform + width);


			})(); 
		}

	})

	const { classes, cx } = useStyles({
		transform
	});

	return <div className={cx(classes.root, className)}>
		<div className={classes.container}>
			{
				slides.map(
					(slide, index) => <div ref={index === 0 ? ref : undefined} key={index} className={classes.slide}>{slide}</div>
				)
			}

		</div>
		<button onClick={slide("left")}>next</button>
		<button onClick={slide("right")}>prev</button>

	</div>
})

const useStyles = makeStyles<{transform: number}>()(
	(theme, {transform}) => ({
		"root": {
		},
		"slide": {
			"position": "relative",
			"minWidth": "80%",
			"left": "10%",
			"padding": theme.spacing(2),
			"transform": `translateX(${transform}px)`,
			"transition": "transform 600ms"

		},
		"container": {
			"display": "flex",
			"position": "relative",
			"overflow": "hidden",
		}
	})
)
