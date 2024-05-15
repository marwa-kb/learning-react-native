import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { likePost, dislikePost } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { icons } from "../constants";

const VideoCard = (props) => {
	const { user } = useGlobalContext();
	const { video: { title, thumbnail, video, liked, $id, creator: { username, avatar }} } = props;
	const [play, setPlay] = useState(false);
	const [isLiked, setIsLiked] = useState(liked.includes(user?.$id) ? true : false);

	const heartPost = async () => {
		try {
			if (isLiked)
				await dislikePost($id, user.$id);
			else
				await likePost($id, user.$id);
			setIsLiked(prev => !prev);
		} catch (error) {
			Alert.alert("Error", "Please try again");			
		}
	};

	useEffect(() => {
		setIsLiked(liked.includes(user?.$id) ? true : false);
	}, [liked]);	

	return (
		<View className="flex-col items-center px-4 mb-14">
			<View className="flex-row gap-3 items-start">
				<View className="justify-center items-center flex-row flex-1">
					<View
						className={`w-[46px] h-[46px] rounded-lg border border-secondary
									flex justify-center items-center p-0.5`}
					>
						<Image
							source={{ uri: avatar }}
							className="w-full h-full rounded-lg"
							resizeMode="cover"
						/>
					</View>

					<View className="justify-center flex-1 ml-3 gap-y-1">
						<Text
							className="text-white font-psemibold text-sm"
							numberOfLines={1}
						>
							{title}
						</Text>
						<Text
							className="text-xs text-gray-100 font-pregular"
							numberOfLines={1}
						>
							{username}
						</Text>
					</View>
				</View>

				<TouchableOpacity
					className="pt-2"
					onPress={heartPost}
				>
					<Image
						source={isLiked ? icons.fullHeart : icons.emptyHeart}
						className="w-5 h-5"
						resizeMode="contain"
					/>
				</TouchableOpacity>
			</View>

			{
				play ? (
					<Video
						source={{ uri: video }}
						className="w-full h-60 rounded-xl mt-3"
						resizeMode={ResizeMode.CONTAIN}
						useNativeControls
						shouldPlay
						onPlaybackStatusUpdate={(status) => {
							if (status.didJustFinish)
								setPlay(false);
						}}
					/>
				)
				:
				(
					<TouchableOpacity
						className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
						activeOpacity={0.7}
						onPress={() => setPlay(true)}
					>
						<Image
							source={{ uri: thumbnail }}
							className="w-full h-full rounded-xl mt-3"
							resizeMode="cover"
						/>
						<Image
							source={icons.play}
							className="w-12 h-12 absolute"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)
			}
		</View>
	);
}

export default VideoCard;