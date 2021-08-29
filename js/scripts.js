$(document).ready(function () {
	let colors = new Array(6);

	// Generates 6 random RGB colors
	const randomRgbColors = () => {
		let color;
		for (let i = 0; i < 6; i++) {
			color = "rgb(";
			for (let j = 0; j < 3; j++) {
				color += Math.round(Math.random() * 255).toString();
				if (j !== 2) color += ", ";
			}
			color += ")";
			colors[i] = color;
		}
	};

	// Converter
	const RGBtoHEX = (rgb) => {
		const hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
		let values = rgb.substr(4).split(",");
		values[2] = values[2].substr(0, values[2].length - 1);
		values = values.map((e) => parseInt(e));

		let hex = "#";
		values.forEach((number) => {
			let first = Math.floor(number / 16);
			let second = (number / 16 - first) * 16;
			hex += hexChars[first];
			hex += hexChars[second];
		});

		return hex;
	};

	// Picks 1 color from the colors array
	const pickColor = () => {
		const index = Math.floor(Math.random() * 6);
		return colors[index];
	};

	// Starts a new round
	const startRound = () => {
		$(".round-count").text(round);
		$(".life-count").text(lifes);
		clicked = false;

		randomRgbColors();
		color = pickColor();

		if (round % 2 === 0) {
			$(".round-type").text("HEX");
			$(".color-text").text(RGBtoHEX(color));
		} else {
			$(".round-type").text("RGB");
			$(".color-text").text(color);
		}

		// Set the background-color of the divs
		colors.forEach((color, i) => {
			$(`.color:nth-child(${i + 1})`).css("background-color", color);
		});

		$(".next-round").hide();
		$(".time-left").show();
		$(".seconds-left").text("9");
		let secondsLeft = 8;
		timeLeft = setInterval(() => {
			$(".seconds-left").text(secondsLeft);
			secondsLeft--;

			if (secondsLeft === -1) {
				lifes--;
				clicked = true;

				endRound();
			}
		}, 1000);
		$(".color").css({ width: "200px", height: "200px" });
		$(".color > div").remove();
	};

	const endRound = () => {
		// Clear timeLeft
		clearInterval(timeLeft);

		// Shows the correct color
		for (let i = 1; i < 7; i++) {
			if ($(`.color:nth-child(${i})`).css("background-color") === color) $(`.color:nth-child(${i})`).append(good);
			else $(`.color:nth-child(${i})`).append(wrong);
		}

		// Next round seconds left
		$(".time-left").hide();
		$(".next-round").show();
		$(".seconds-left").text("3");
		let secondsLeft = 2;
		nextRoundIn = setInterval(() => {
			$(".seconds-left").text(secondsLeft);
			secondsLeft--;
		}, 1000);

		// End game
		if (!lifes) {
			$(".life-count").text("0");
			$(".game-over .count").text(round);
			$(".game-over").animate({ right: "0" }, 300);
			clearInterval(nextRoundIn);
		} else if (round === 101) {
			$(".win").animate({ left: "0" }, 1000);
			clearInterval(nextRoundIn);
		} else {
			// Start new round
			nextRound = setTimeout(() => {
				startRound();
				clearInterval(nextRoundIn);
			}, 3000);
		}
	};

	let round = 1;
	let lifes = 3;
	let color;
	let clicked = false;
	let newColorsOption = 3;
	const good = '<div class="good"><i class="far fa-check-circle"></i></div>';
	const wrong = '<div class="wrong"><i class="far fa-times-circle"></i></div>';
	let timeLeft, nextRoundIn, nextRound;

	startRound();

	$(".new-colors").click(function () {
		if (newColorsOption) {
			randomRgbColors();
			const index = Math.floor(Math.random() * 6);
			colors[index] = color;

			colors.forEach((color, i) => {
				$(`.color:nth-child(${i + 1})`).css("background-color", color);
			});

			// Set the width of the line before the NEW COLORS button
			$(this).removeClass(`remaining-${newColorsOption}`);
			newColorsOption--;
			$(this).addClass(`remaining-${newColorsOption}`);
		}
	});

	$(".color").click(function () {
		if (!clicked) {
			$(this).css({ width: "210px", height: "210px" });

			if ($(this).css("background-color") === color) round++;
			else lifes--;

			endRound();
			clicked = true;
		}
	});

	$(".new-game").click(function () {
		if (lifes) $(".win").animate({ left: "-100vw" }, 100);
		else $(".game-over").animate({ right: "-100vw" }, 100);

		lifes = 3;
		round = 1;
		clicked = false;
		newColorsOption = 3;
		startRound();
	});
});
