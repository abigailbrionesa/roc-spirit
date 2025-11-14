
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ARScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<any>(null);

	if (!permission) {
		// Camera permissions are still loading
		return <View style={styles.container} />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet
		return (
			<SafeAreaProvider>
				<SafeAreaView style={styles.permissionContainer}>
					<Text style={styles.permissionText}>We need camera access</Text>
					<Text style={styles.permissionSub}>Camera access is required for AR experiences.</Text>
					<TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
						<Text style={styles.permissionButtonText}>Grant Permission</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<CameraView
					ref={cameraRef}
					style={styles.camera}
					facing="back"
				/>

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
		marginBottom: 20,
	},
	permissionButton: {
		backgroundColor: '#2563eb',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	permissionButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
