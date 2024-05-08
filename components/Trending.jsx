import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn = {
	0: {
		scale: 0.9,
	},
	1: {
		scale: 1.1,
	}
};

const zoomOut = {
	0: {
		scale: 1.1,
	},
	1: {
		scale: 0.9,
	}
}

const TrendingItem = (props) => {
	const [play, setPlay] = useState(false);

	return (
		<Animatable.View
			className="mr-5"
			animation={props.activeItem === props.item.$id ? zoomIn : zoomOut}
			duration={500}
		>
			{
				play ?
					<Video
						source={{ uri: props.item.video }}
						className="w-52 h-72 rounded-[35px] mt-3 bg-white/70"
						resizeMode={ResizeMode.CONTAIN}
						useNativeControls
						shouldPlay
						onPlaybackStatusUpdate={(status) => {
							if (status.didJustFinish)
								setPlay(false);
						}}
					/>
				:
					<TouchableOpacity
						className="relative justify-center items-center"
						activeOpacity={0.7}
						onPress={() => setPlay(true)}
					>
						<ImageBackground
							source={{ uri: props.item.thumbnail }}
							className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
							resizeMode="cover"
						/>
						<Image
							source={icons.play}
							className="w-12 h-12 absolute"
							resizeMode="contain"
						/>
					</TouchableOpacity>
			}
		</Animatable.View>
	);
}

const Trending = (props) => {
	const [activeItem, setActiveItem] = useState(props.posts[1]);

	const viewableItemsChanged = ({ viewableItems }) => {
		if (viewableItems.length > 0)
			setActiveItem(viewableItems[0].key)
	};

	return (
		<FlatList
			data={props.posts}
			keyExtractor={(item) => item.$id}
			renderItem={({ item }) => (
				<TrendingItem
					activeItem={activeItem}
					item={item}
				/>
			)}
			onViewableItemsChanged={viewableItemsChanged}
			viewabilityConfig={{
				itemVisiblePercentThreshold: 70
			}}
			contentOffset={{ x: 170 }}
			horizontal
		/>
	);
}

export default Trending;