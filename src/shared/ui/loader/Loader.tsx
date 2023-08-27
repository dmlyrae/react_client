import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './Loader.module.scss';

import type { PropsWithChildren } from 'react';

interface LoaderProps {
    className?: string;
}

export function Loader(props: PropsWithChildren<LoaderProps>) {
    const { className } = props;

    return (
        <div className={classNames(cl.Loader, {}, [className])} >
            <div />
            <div />
            <div />
        </div>
    )
}