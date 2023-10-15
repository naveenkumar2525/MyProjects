import React, { Suspense } from 'react';
import Loading from '../V5GlobalLoading/V5GlobalLoading'

const Loadable = (Component) => (props) => (
   <Suspense fallback={<Loading />}>
      <Component {...props} />
   </Suspense>
);

export default Loadable;