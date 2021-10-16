// link to docs for wtr and chai?

import { expect } from 'chai';
import { sum } from './utilities';

it( 'sums up 2 numbers', () => {
	expect( sum( 1, 1 ) ).to.equal( 2 );
	expect( sum( 3, 12 ) ).to.equal( 15 );
	expect( sum( 8, 5 ) ).to.equal( 13 );
} );
