import { Client, Account, ID, Avatars, Databases, Query, Storage } from "react-native-appwrite";

export const config = {
	endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
	platform: process.env.EXPO_PUBLIC_PLATFORM,
	projectId: process.env.EXPO_PUBLIC_PROJECTID,
	databaseId: process.env.EXPO_PUBLIC_DATABASEID,
	userCollectionId: process.env.EXPO_PUBLIC_USERCOLLECTIONID,
	videoCollectionId: process.env.EXPO_PUBLIC_VIDEOCOLLECTIONID,
	storageId: process.env.EXPO_PUBLIC_STORAGEID,
};

const client = new Client();
client
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)
	.setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);
		if (!newAccount)
			throw Error;
		const avatarUrl = avatars.getInitials(username);
		await signIn(email, password);
		const newUser = await databases.createDocument(
			config.databaseId,
			config.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email,
				username,
				avatar: avatarUrl
			}
		);
		return newUser;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export const signIn = async (email, password) => {
	try {
		const session = await account.createEmailPasswordSession(
			email,
			password
		);
		return session;
	} catch (error) {
		throw new Error(error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();
		if (!currentAccount)
			throw Error;

		const currentUser = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);
		if (!currentUser)
			throw Error;
		return (currentUser.documents[0]);
	} catch (error) {
		console.log(error);
	}
};

export const getAllPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.orderDesc("$createdAt")]
		);
		return (posts.documents);
	} catch (error) {
		throw new Error(error);
	}
};

export const getLatestPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.orderDesc("$createdAt", Query.limit(7))]
		);
		return (posts.documents);
	} catch (error) {
		throw new Error(error);
	}
};

export const searchPosts = async (query) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.search("title", query)]
		);
		return (posts.documents);
	} catch (error) {
		throw new Error(error);
	}
};

export const getUserPosts = async (userId) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.equal("creator", userId), Query.orderDesc("$createdAt")]
		);
		return (posts.documents);
	} catch (error) {
		throw new Error(error);
	}
};

export const signOut = async () => {
	try {
		const session = await account.deleteSession("current");
		return (session);
	} catch (error) {
		throw new Error(error);		
	}
}

export const getFilePreview = async (fileId, type) => {
	let fileUrl;
	try {
		if (type === "video")
			fileUrl = storage.getFileView(config.storageId, fileId);
		else if (type === "image")
			fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, "top", 100);
		else
			throw new Error("Invalid file type");

		if (!fileUrl)
			throw new Error;
		return (fileUrl);
	} catch (error) {
		throw new Error(error);
	}
}

export const uploadFile = async (file, type) => {
	if (!file)
		return;

	const asset = { 
		name: file.fileName,
		type: file.mimeType,
		size: file.filesize,
		uri: file.uri		
	};
	try {
		const uploadedFile = await storage.createFile(
			config.storageId,
			ID.unique(),
			asset
		);
		const fileUrl = await getFilePreview(uploadedFile.$id, type);
		return (fileUrl);
	} catch (error) {
		throw new Error(error);
	}
}

export const createPost = async (form) => {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, "image"),
			uploadFile(form.video, "video"),
		]);
		const newPost = await databases.createDocument(
			config.databaseId,
			config.videoCollectionId,
			ID.unique(),
			{
				title: form.title,
				video: videoUrl,
				thumbnail: thumbnailUrl,
				prompt: form.prompt,
				creator: form.userId
			}
		);
		return (newPost);
	} catch (error) {
		throw new Error(error);		
	}
}

export const likePost = async (videoId, userId) => {
	try {
		const post = await databases.getDocument(
			config.databaseId,
			config.videoCollectionId,
			videoId
		);
		await databases.updateDocument(
			config.databaseId,
			config.videoCollectionId,
			videoId,
			{
				liked: [...post.liked, userId]
			}
		);
	} catch (error) {
		throw new Error(error);		
	}
}

export const dislikePost = async (videoId, userId) => {
	try {
		const post = await databases.getDocument(
			config.databaseId,
			config.videoCollectionId,
			videoId
		);
		const removedLike = post.liked.filter((item) => item !== userId);
		await databases.updateDocument(
			config.databaseId,
			config.videoCollectionId,
			videoId,
			{
				liked: removedLike
			}
		);
	} catch (error) {
		throw new Error(error);		
	}
}

export const getUserLikedPosts = async (userId) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.contains("liked", userId)]
		);
		return (posts.documents);
	} catch (error) {
		throw new Error(error);
	}
};

export const searchLikedPosts = async (userId, query) => {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.search("title", query), Query.contains("liked", userId)]
		);
		return (posts.documents);
	} catch (error) {
		throw new Error(error);
	}
};
