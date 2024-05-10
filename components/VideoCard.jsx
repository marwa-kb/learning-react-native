import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { icons } from '../constants';
import { useState } from "react";
import { ResizeMode, Video } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider';
import { likePost } from '../lib/appwrite';

const VideoCard = (props) => {
	const { user } = useGlobalContext();
	const { video: { title, thumbnail, video, liked, $id, creator: { username, avatar }} } = props;
	const [play, setPlay] = useState(false);
	const [isLiked, setIsLiked] = useState(liked.filter((item) => item === user.$id).length ? true : false);

	const heartPost = async () => {
		try {
			await likePost($id, user.$id);
			setIsLiked(!isLiked);
		} catch (error) {
			Alert.alert("Error", "Please try again");			
		}
	}

	return (
		<View className="flex-col items-center px-4 mb-14">
			<View className="flex-row gap-3 items-start">
				<View className="justify-center items-center flex-row flex-1">
					<View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
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