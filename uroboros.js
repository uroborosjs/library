const
{ readFileSync
, writeFileSync
} = require('fs')
const
{ resolve
} = require('path')

const makeAbsolutePath =
  (relativePath) =>
    resolve(process.cwd(), relativePath)

const readJsonSync =
  (path) => {
    const absPath = makeAbsolutePath(path)
    const jsonStr = readFileSync(absPath, 'utf8')
    const obj = JSON.parse(jsonStr)

    return obj
  }

const writeJsonSync =
  (path) =>
    (data) => {
      const jsonStr = JSON.stringify(data, null, 2)
      writeFileSync(path, `${jsonStr}\n`)
    }

const questions =
  [ { question: 'Project name'
    , property: 'name'
    }
  , { question: 'Project description'
    , property: 'description'
    }
  , { question: 'Project author'
    , property: 'author'
    }
  , { question: 'Github location (<user>/<project>)'
    , property: 'location'
    }
  ]

const formatRepository =
  (location) => (
    { type: 'git'
    , url: `git+https://github.com/${location}.git`
    }
  )

const formatBugs =
  (location) => (
    { url: `https://github.com/${location}/issues`
    }
  )

const formatHomepage = (location) => `https://github.com/${location}#readme`

const updatePackageJson =
  ( { name
    , description
    , author
    , repository
    , bugs
    , homepage
    }
  ) =>
    (packageJson) => (
      { ...packageJson
      , name
      , description
      , repository
      , bugs
      , homepage
      }
    )

const setup =
  ( { name
    , description
    , author
    , location
    }
  ) => {
    const packageJson = readJsonSync('./package.json')
    const newPackageJson =
      updatePackageJson
      ( { name
        , description
        , author
        , repository: formatRepository(location)
        , bugs: formatBugs(location)
        , homepage: formatHomepage(location)
        }
      )
      ( packageJson )
    writeJsonSync ('./package.json') (newPackageJson)

    return null
  }

module.exports =
  { questions
  , setup
  }
