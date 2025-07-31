import { decodeJwt } from "jose";
import axios from "axios";

const decodeUserInfoResponse = async (userinfoJwtToken: string) => {
	try {
		return decodeJwt(userinfoJwtToken);
	} catch (error) {
		console.error("Error decoding JWT user info:", error);
		return null;
	}
};
export async function getUserInfo(accessToken: string) {
	const userInfoResponse = await axios.get(process.env.USERINFO_ENDPOINT!, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	const decodedUserInfo = await decodeUserInfoResponse(userInfoResponse.data);
	return decodedUserInfo;
}
