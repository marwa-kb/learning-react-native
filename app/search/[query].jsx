import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { searchPosts, searchLikedPosts } from "../../lib/appwrite";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Search = () => {
	const { user } = useGlobalContext();
	const { query, searchType } = useLocalSearchParams();
	let fetchedData = {};
	if (searchType === "liked")
		fetchedData = useAppwrite(() => searchLikedPosts(user.$id, query));
	else
		fetchedData = useAppwrite(() => searchPosts(query));
	const { data: posts, refetch } = fetchedData;
	console.log("DATA", posts)

	useEffect(() => {
		refetch();
	}, [query]);	

	return (
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<VideoCard video={item}/>
				)}
				ListHeaderComponent={() => (
					<View className="my-6 px-4">
						<Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
						<Text className="text-2xl font-psemibold text-white">{query}</Text>
						<View className="mt-6 mb-8">
							<SearchInput initialQuery={query} placeholder="Search for a video topic" searchType={searchType} />
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="No videos found for this search query"
					/>
				)}
			/>

			<StatusBar backgroundColor="#161622" style="light" />
		</SafeAreaView>
	)
};

export default Search;
