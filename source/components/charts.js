/**
 * WordPress dependencies
 */
const { Card, CardHeader, CardBody } = window.wp.components;
const html = window.wp.html;

export function Charts( {} ) {
	return html`
		<${ Card }>
			<${ CardHeader }>
				Charts
			<//>

			<${ CardBody }>
                <p>
                This will be an example of importing a CommonJS module from NPM. It'll be up-converted to an ES module that you can use with a native <code>import</code>.

                <!--
                if module was included
                this will show how you can import a CommonJS module from NPM, but import it like an ESM
                thanks to Snowpack [link]

                else
                running 'npm install' is required for this to work, even if you're not using a build step
                -->
                </p>

				<${ ReactChart } />
			<//>
		<//>
	`;
}




/*
 * courtesy of https://codepen.io/createwithdata/pen/aXZVWX
 *
 * replace w/ https://github.com/reactchartjs/react-chartjs-2 once npm imports working
 */

// Data generation
function getRandomArray( numItems ) {
	// Create random array of objects
	let names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let data = [];
	for ( var i = 0; i < numItems; i ++ ) {
		data.push( {
			label: names[ i ],
			value: Math.round( 20 + 80 * Math.random() )
		} );
	}
	return data;
}

function getRandomDateArray( numItems ) {
	// Create random array of objects (with date)
	let data = [];
	let baseTime = new Date( '2018-05-01T00:00:00' ).getTime();
	let dayMs = 24 * 60 * 60 * 1000;
	for ( var i = 0; i < numItems; i ++ ) {
		data.push( {
			time: new Date( baseTime + i * dayMs ),
			value: Math.round( 20 + 80 * Math.random() )
		} );
	}
	return data;
}

function getData() {
	let data = [];

	data.push( {
		title: 'Visits',
		data: getRandomDateArray( 150 )
	} );

	data.push( {
		title: 'Categories',
		data: getRandomArray( 20 )
	} );

	data.push( {
		title: 'Categories',
		data: getRandomArray( 10 )
	} );

	data.push( {
		title: 'Data 4',
		data: getRandomArray( 6 )
	} );

	return data;
}

class DoughnutChart extends React.Component {
	constructor( props ) {
		super( props );
		this.canvasRef = React.createRef();
	}

	componentDidUpdate() {
		this.myChart.data.labels = this.props.data.map( d => d.label );
		this.myChart.data.datasets[ 0 ].data = this.props.data.map( d => d.value );
		this.myChart.update();
	}

	componentDidMount() {
		this.myChart = new Chart( this.canvasRef.current, {
			type: 'doughnut',
			options: {
				maintainAspectRatio: false
			},
			data: {
				labels: this.props.data.map( d => d.label ),
				datasets: [{
					data: this.props.data.map( d => d.value ),
					backgroundColor: this.props.colors
				}
				]
			}
		} );

	}

	render() {
		return html`<canvas ref=${ this.canvasRef } />`;
	}
}

class ReactChart extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			data: getData()
		};
	}

	componentDidMount() {
		window.setInterval( () => {
			this.setState( {
				data: getData()
			} );
		}, 5000 );
	}

	render() {
		return (
			html`
                <div className="App">
                  <div className="sub chart-wrapper">
                    <${ DoughnutChart }
                      data=${ this.state.data[ 3 ].data }
                      title=${ this.state.data[ 3 ].title }
                      colors=${ ['#a8e0ff', '#8ee3f5', '#70cad1', '#3e517a', '#b08ea2', '#BBB6DF'] }
                    />
                  </div>
                </div>
            `
		);
	}
}
