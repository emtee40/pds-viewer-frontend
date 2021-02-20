import React, {FunctionComponent} from 'react';

type Props = {
    text?: string
}

const Loader: FunctionComponent<Props> = ({text}: Props) => {
    return (
        <div id={'loader'}>
            <div className="loading-spinner">
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
            <p>{text || 'Fetching PDS data...'}</p>
        </div>
    );
}

export default Loader;
