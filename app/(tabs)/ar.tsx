
import * as ExpoCamera from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ARScreen() {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
		const [isReady, setIsReady] = useState(false);
		const cameraRef = useRef<any>(null);
		const CameraComp: any = (ExpoCamera as any).Camera;

	useEffect(() => {
		let mounted = true;
			(async () => {
						try {
							const { status } = await (ExpoCamera as any).requestCameraPermissionsAsync();
					if (!mounted) return;
					setHasPermission(status === 'granted');
				} catch {
					if (!mounted) return;
					setHasPermission(false);
				} finally {
					if (mounted) setIsReady(true);
				}
			})();

		return () => {
			mounted = false;
		};
	}, []);

	if (!isReady) {
		return null;
	}

	if (hasPermission === false) {
		return (
			<SafeAreaProvider>
				<SafeAreaView style={styles.permissionContainer}>
					<Text style={styles.permissionText}>Camera permission denied.</Text>
					<Text style={styles.permissionSub}>Please enable camera permissions in system settings.</Text>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
						{hasPermission ? (
							<CameraComp
								ref={cameraRef}
								style={styles.camera}
								ratio="16:9"
								type={(ExpoCamera as any).CameraType?.back ?? 'back'}
							/>
						) : (
					<View style={styles.cameraPlaceholder} />
				)}

				{/* Right-aligned vertical buttons */}
				<View style={styles.rightButtons} pointerEvents="box-none">
					<TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => {}}>
						<Text style={styles.btnText}>soon</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => {}}>
						<Text style={styles.btnText}>soon</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={() => {}}>
						<Text style={styles.btnText}>soon</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	camera: {
		width: width,
		height: height,
	},
	cameraPlaceholder: {
		flex: 1,
		backgroundColor: '#111',
	},
	rightButtons: {
		position: 'absolute',
		right: 12,
		top: '30%',
		height: 220,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	btn: {
		width: 64,
		height: 44,
		borderRadius: 12,
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 6,
		paddingHorizontal: 6,
	},
	btnText: {
		color: '#fff',
		fontSize: 14,
		textTransform: 'lowercase',
	},
	permissionContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	permissionText: {
		color: '#fff',
		fontSize: 18,
		marginBottom: 8,
	},
	permissionSub: {
		color: '#ccc',
		fontSize: 14,
		textAlign: 'center',
	},
});
