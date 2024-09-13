"use client"

import React from "react";
import arrowIcon from '@/assets/images/arrow.svg';
import Image from "next/image"
import classnames from 'classnames';
import { useActiveIndex } from '../../store/useGlobalState'

import styles from './index.module.css'

interface CollapseProps {
  title: string;
  activeIndex: number;
  children: React.ReactNode
}

export default function Collapse(props: CollapseProps) {
  const { activeIndex } = props;
  const { activeIndex: currentActiveIndex, setActiveIndex } = useActiveIndex();

  const changeActiveIndex = () => {
    if (activeIndex === currentActiveIndex) {
      setActiveIndex(0)
    } else {
      setActiveIndex(activeIndex)
    }
  }

  return (
    <div className={classnames(styles.collapse, activeIndex === currentActiveIndex ? '' : styles['collapse-closed'])}>
      <div className={styles['collapse-header']}>
        <span className={styles['collapse-title']}>{props.title}</span>
        <Image src={arrowIcon} alt="arrow" className={classnames(styles['arrow-icon'], activeIndex === currentActiveIndex ? '' : styles['arrow-icon-closed'])} onClick={changeActiveIndex} ></Image>
      </div>
      <div className={classnames(styles['collapse-content'], activeIndex === currentActiveIndex ? '' : styles['collapse-content-hidden'])}>
        {props.children}
      </div>
    </div>
  )
}