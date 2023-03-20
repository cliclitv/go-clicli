import { h, useEffect, useState } from 'fre'


export default function Home({ k }) {
    const [search, setSearch] = useState([])

    return (
        <div>
            <div className="wrap">
                <main>
                    <h1>Search Videos</h1>
                </main>
            </div>
        </div>
    )
}