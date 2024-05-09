import { View, Text } from "react-native";

const InfoBox = (props) => {
	return (
		<View className={props.containerStyles}>
			<Text
				className={`text-white text-center font-psemibold ${props.titleStyles}`}
			>
				{props.title}
			</Text>
			<Text
				className="text-sm text-gray-100 text-center font-pregular"
			>
				{props.subtitle}
			</Text>
		</View>
	);
};

export default InfoBox;
