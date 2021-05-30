import {createClient} from 'contentful'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

 const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken:process.env.CONTENTFUL_ACCESS_KEY,
  });

export async function getStaticPaths() {
    const res = await client.getEntries({ content_type : 'recipe'});

    // Get the paths we want to pre-render based on posts
    const paths = res.items.map((item) => ({
      params: { slug: item.fields.slug},
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }
  
  export async function getStaticProps({params}) {
  
    const res = await client.getEntries({ content_type : 'recipe',

    'fields.slug': params.slug,
})
    return {
       props: {
         recipe : res.items[0],
         revalidate: 1
       }
    }
  
  }
  


export default function RecipeDetails({recipe}) {
    console.log(recipe)
    const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields
    return (
        <div>
        <div className="banner">
          <Image 
            src={'https:' + featuredImage.fields.file.url}
            width={featuredImage.fields.file.details.image.width}
            height={featuredImage.fields.file.details.image.height}
          />
          <h2>{ title }</h2>
        </div>
  
        <div className="info">
          <p>Takes about { cookingTime } mins to cook.</p>
          <h3>Ingredients:</h3>
  
          {ingredients.map(ing => (
            <span key={ing}>{ ing }</span>
          ))}
        </div>
          
        <div className="method">
          <h3>Method:</h3>
          <div className="doc">{documentToReactComponents(method)}</div>
        </div>
  
        <style jsx>{`
        .doc {
            overflow-wrap: break-word;
            
        }
          h2,h3 {
            text-transform: uppercase;
          }
          .banner h2 {
            margin: 0;
            background: #fff;
            display: inline-block;
            padding: 20px;
            position: relative;
            top: -60px;
            left: -10px;
            transform: rotateZ(-1deg);
            box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
          }
          .info p {
            margin: 0;
          }
          .info span::after {
            content: ", ";
          }
          .info span:last-child::after {
            content: ".";
          }
          .method > div {
              width: 100%;
          }
        `}</style>
      </div>
    )
  }