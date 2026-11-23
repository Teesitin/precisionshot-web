export interface ProjectModel {
	name: string;
	file: string;
	size: string;
	zUp: boolean;
	material: boolean;
	frontNegativeZ?: boolean;
	group: 'Enclosure V8' | 'Electronics';
}

export const enclosureDownload = {
	href: '/downloads/PrecisionShot_V8_Enclosure_STEP_STL_OBJ.zip',
	filename: 'PrecisionShot_V8_Enclosure_STEP_STL_OBJ.zip'
};

export const models: ProjectModel[] = [
	{ name: 'Complete enclosure V8', file: '2026-11-23-v8/PrecisionShot_V8_Enclosure_Assembled', size: '11.6 MB', zUp: false, frontNegativeZ: true, material: false, group: 'Enclosure V8' },
	{ name: 'Optical grid · T01', file: '2026-11-23-v8/OBJ/T01_R12_hollow_post_optical_grid', size: '3.2 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Optical faceplate · T02', file: '2026-11-23-v8/OBJ/T02_R3_optical_faceplate', size: '0.55 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Lower sensor base · T04', file: '2026-11-23-v8/OBJ/T04_Lower_sensor_base', size: '0.41 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Upper sensor base · T05', file: '2026-11-23-v8/OBJ/T05_Upper_sensor_base', size: '0.67 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Lower sensor rear cover · T06', file: '2026-11-23-v8/OBJ/T06_Lower_sensor_rear_cover', size: '1.3 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Upper sensor rear cover · T07', file: '2026-11-23-v8/OBJ/T07_Upper_sensor_rear_cover', size: '0.81 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Main board enclosure · T09', file: '2026-11-23-v8/OBJ/T09_Main_board_enclosure', size: '1.5 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Main board rear lid · T10', file: '2026-11-23-v8/OBJ/T10_Main_board_rear_lid', size: '0.89 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Dual regulator cradle · T11', file: '2026-11-23-v8/OBJ/T11_Dual_regulator_cradle', size: '19 KB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Display spacer frame · T12', file: '2026-11-23-v8/OBJ/T12_Display_spacer_frame', size: '0.17 MB', zUp: true, material: false, group: 'Enclosure V8' },
	{ name: 'Main board V4', file: '2026-10-06/Main Board V4', size: '38 MB', zUp: true, material: true, group: 'Electronics' },
	{ name: 'Sensor board', file: '2026-10-06/Sensor Board', size: '56 MB', zUp: true, material: true, group: 'Electronics' },
	{ name: '3.3 V / 5 V regulator board', file: '2026-10-06/Regulator Board', size: '4.5 MB', zUp: true, material: true, group: 'Electronics' }
];
