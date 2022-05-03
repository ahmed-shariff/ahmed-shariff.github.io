import React from 'react';
import { parse, format } from 'fecha';

export default function SlugToDate({slug}) {
    if (slug === undefined) {
        return;
    } else {
        return (
            <React.Fragment>
                {format(parse(slug.substring(0, 10), "YYYY-MM-DD"), "MMMM D, YYYY")}
            </React.Fragment>
        );
    }
}
