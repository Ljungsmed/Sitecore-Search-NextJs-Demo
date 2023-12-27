'use client'

import Image from 'next/image'
import styles from './page.module.css'

import SearchResults from './Components/SearchResult'

import { WidgetDataType, widget } from '@sitecore-search/react';
import { WidgetsProvider } from '@sitecore-search/react';

export default function Home() {
  return (
    

    <div>
      <WidgetsProvider
        env='prod'
        customerKey='81830035-18560676'
        apiKey='01-4dde1baf-e61548dedf17131fe0d747bb7e686079bca5e21a'
      >
        <SearchResults rfkId="rfkid_7" />
      </WidgetsProvider>
    </div>
  )
}
