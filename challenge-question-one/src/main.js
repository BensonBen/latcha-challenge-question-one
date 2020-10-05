import Moon from "moon";
import view from "view/index";
import "main.css";

Moon.use({
	data: Moon.data.driver,
	view: Moon.view.driver("#root"),
	http: Moon.http.driver
});

Moon.run(() => {
	const data = {
		title: `Restaurant Search`,
		tableNames: ["Name", "Rating", "Food Types"],
		searchParameters: 'ec4m',
		searchResults: []
	};

	return {
		data,
		view: <view.home data=data/>
	};
});
