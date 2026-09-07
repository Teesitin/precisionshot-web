import mainHardware from '../../flowcharts/3_01_hardware_block_diagram_and_team_responsibility_breakdown copy.mermaid?raw';
import software from '../../flowcharts/overview/software_design.mermaid?raw';
import hardware from '../../flowcharts/overview/hardware_design.mermaid?raw';
import pcb from '../../flowcharts/overview/pcb_design.mermaid?raw';
import mechanical from '../../flowcharts/overview/mechanical_design.mermaid?raw';

// Curated homepage outline. Detailed report diagrams remain in flowcharts/,
// but adding a source file there must not automatically expand the homepage.
export const flowcharts = [
	{
		path: '../../flowcharts/3_01_hardware_block_diagram_and_team_responsibility_breakdown copy.mermaid',
		title: '3.01 Hardware Block Diagram and Team Responsibility Breakdown copy',
		chart: mainHardware
	},
	{ path: 'overview/software_design', title: 'Software Design', chart: software },
	{ path: 'overview/hardware_design', title: 'Hardware Design', chart: hardware },
	{ path: 'overview/pcb_design', title: 'PCB Design', chart: pcb },
	{ path: 'overview/mechanical_design', title: 'Mechanical Design', chart: mechanical }
];
