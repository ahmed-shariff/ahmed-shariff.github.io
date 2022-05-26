import React from 'react';
import { parse, format } from 'fecha';

export function slugToDate(slug) {
    return parse(slug.substring(0, 10), "YYYY-MM-DD");
}

export default function SlugToDate({ slug }) {
    if (slug === undefined) {
        return;
    } else {
        return (
            <React.Fragment>
                {format(slugToDate(slug), "MMMM D, YYYY")}
            </React.Fragment>
        );
    }
}
