import React, {FunctionComponent} from 'react';

type Props = {}

const Loader: FunctionComponent<Props> = () => {
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
        </div>
    );
}

export default Loader;
