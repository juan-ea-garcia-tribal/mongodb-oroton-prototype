import React from 'react'
import axios from 'axios'
import type {
    GetStaticPathsContext,
    GetStaticProps,
    InferGetStaticPropsType,
  } from 'next'

 

  async function getProductSlugs(){
    const res = await axios({
      url: 'https://ap-southeast-2.aws.realm.mongodb.com/api/client/v2.0/app/application-0-lmrek/graphql',
      method: 'post',
      headers:{
        'apiKey': `jbLQSDbjFLPNpsd05dDug5syEQk4ZC7Hq1Les4PnxoiDNka3FGLdLb4ECvBGAipd`
    },
    data:{
      query: `
      query {
        products{
          slug
        }
        }
      `
    }
    })
    return res
  }



async function getProductBySlug(query: any){
  const res = await axios({
    url: 'https://ap-southeast-2.aws.realm.mongodb.com/api/client/v2.0/app/application-0-lmrek/graphql',
    method: 'post',
    headers:{
      'apiKey': `jbLQSDbjFLPNpsd05dDug5syEQk4ZC7Hq1Les4PnxoiDNka3FGLdLb4ECvBGAipd`
  },
  data:{
    query: `
    query {
      products(query:{slug: "${query}"}){
        name
        description
        price
        slug
      }
    }
    `
  }
  })
  return res
}

  export const getStaticProps: GetStaticProps = async (context) => {

    const {data} = await getProductBySlug(context?.params?.slug)

    return {
      props:{
        product: data.data.products[0]
      }
    }
  }
  


  export async function getStaticPaths({ locales }: GetStaticPathsContext) {
    const { data } = await getProductSlugs()
    const paths = data.data.products.map((el: any) => {
     return  {params: {"slug": el.slug}}
    })
    console.log(paths)
    return {
      paths: paths,
      fallback: 'blocking',
    }
  }

export default function Slug({product}: any) {
  console.log(product)
  return (
    <div>{JSON.stringify(product)}</div>
  )
}
