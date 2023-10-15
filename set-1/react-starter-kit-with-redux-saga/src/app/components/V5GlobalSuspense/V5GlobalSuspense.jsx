import React, { Suspense } from 'react'
import { V5GlobalLoading } from 'app/components'

const V5GlobalSuspense = ({ children }) => {
    return <Suspense fallback={<V5GlobalLoading />}>{children}</Suspense>
}

export default V5GlobalSuspense
