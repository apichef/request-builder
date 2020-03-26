import Api from './Api'
import {HttpMethod} from "../src/HttpMethod";
import {SortDirection} from "../src/SortDirection";
import {QueryConfig} from "../src";

describe('builder', () => {
    describe('all', () => {
        test('generates fetch resource list request config', async () => {
            const { url, method } = await new Api('posts').all()

            expect(url).toBe('/posts')
            expect(method).toBe(HttpMethod.GET)
        })
    })

    describe('get', () => {
        test('generates fetch resource list request config when id is not given', async () => {
            const { url, method } = await new Api('posts').get()

            expect(url).toBe('/posts')
            expect(method).toBe(HttpMethod.GET)
        })

        test('generates fetch single resource request config when id is given', async () => {
            const { url, method } = await new Api('posts').find('pid007')

            expect(url).toBe('/posts/pid007')
            expect(method).toBe(HttpMethod.GET)
        })
    })

    describe('save', () => {
        test('generates create resource request config', async () => {
            const payload = { foo: 'bar' };
            const { url, method, data } = await new Api('posts').save(payload)

            expect(url).toBe('/posts')
            expect(method).toBe(HttpMethod.POST)
            expect(data).toBe(payload)
        })

        test('generates update resource request config', async () => {
            const payload = { foo: 'bar' };
            const { url, method, data } = await new Api('posts').save(payload, HttpMethod.PATCH)

            expect(url).toBe('/posts')
            expect(method).toBe(HttpMethod.PATCH)
            expect(data).toBe(payload)
        })
    })

    describe('with', () => {
        describe('all', () => {
            test('generates fetch resource request config with includes', async () => {
                const { url, method } = await new Api('posts')
                    .with('author')
                    .all()

                expect(url).toBe('/posts?include=author')
                expect(method).toBe(HttpMethod.GET)
            })

            test('with accepts relationships an an array', async () => {
                const { url, method } = await new Api('posts')
                    .with(['author', 'comments', 'tags'])
                    .all()

                // /posts?include=author,comments,tags
                expect(url).toBe('/posts?include=author%2Ccomments%2Ctags')
                expect(method).toBe(HttpMethod.GET)
            })

            test('can chain', async () => {
                const { url, method } = await new Api('posts')
                    .with(['author', 'comments'])
                    .with('tags')
                    .all()

                // /posts?include=author,comments,tags
                expect(url).toBe('/posts?include=author%2Ccomments%2Ctags')
                expect(method).toBe(HttpMethod.GET)
            })
        })

        describe('get', () => {
            test('generates fetch resource request config with includes', async () => {
                const { url, method } = await new Api('posts')
                    .with('author')
                    .find('pid007')

                expect(url).toBe('/posts/pid007?include=author')
                expect(method).toBe(HttpMethod.GET)
            })

            test('with accepts relationships an an array', async () => {
                const { url, method } = await new Api('posts')
                    .with(['author', 'comments', 'tags'])
                    .find('pid007')

                // /posts/pid007?include=author,comments,tags
                expect(url).toBe('/posts/pid007?include=author%2Ccomments%2Ctags')
                expect(method).toBe(HttpMethod.GET)
            })
        })
    })

    describe('without', () => {
        describe('all', () => {
            test('generates fetch resource request config with includes', async () => {
                const { url, method } = await new Api('posts')
                    .without('author')
                    .all()

                expect(url).toBe('/posts?exclude=author')
                expect(method).toBe(HttpMethod.GET)
            })

            test('without accepts relationships an an array', async () => {
                const { url, method } = await new Api('posts')
                    .without(['author', 'comments', 'tags'])
                    .all()

                // /posts?exclude=author,comments,tags
                expect(url).toBe('/posts?exclude=author%2Ccomments%2Ctags')
                expect(method).toBe(HttpMethod.GET)
            })

            test('can chain', async () => {
                const { url, method } = await new Api('posts')
                    .without(['author', 'comments'])
                    .without('tags')
                    .all()

                // /posts?exclude=author,comments,tags
                expect(url).toBe('/posts?exclude=author%2Ccomments%2Ctags')
                expect(method).toBe(HttpMethod.GET)
            })
        })

        describe('get', () => {
            test('generates fetch resource request config with includes', async () => {
                const { url, method } = await new Api('posts')
                    .without('author')
                    .find('pid007')

                expect(url).toBe('/posts/pid007?exclude=author')
                expect(method).toBe(HttpMethod.GET)
            })

            test('without accepts relationships an an array', async () => {
                const { url, method } = await new Api('posts')
                    .without(['author', 'comments', 'tags'])
                    .find('pid007')

                // /posts/pid007?exclude=author,comments,tags
                expect(url).toBe('/posts/pid007?exclude=author%2Ccomments%2Ctags')
                expect(method).toBe(HttpMethod.GET)
            })
        })
    })

    describe('where', () => {
        test('generates fetch resources request config with filters', async () => {
            const { url, method } = await new Api('posts')
                .where('author', 'Bob')
                .all()

            // /posts?filter[author]=Bob
            expect(url).toBe('/posts?filter%5Bauthor%5D=Bob')
            expect(method).toBe(HttpMethod.GET)
        })

        test('can filter without a value', async () => {
            const { url, method } = await new Api('posts')
                .where('published')
                .all()

            // /posts?filter[published]=
            expect(url).toBe('/posts?filter%5Bpublished%5D=')
            expect(method).toBe(HttpMethod.GET)
        })

        test('can chain', async () => {
            const { url, method } = await new Api('posts')
                .where('published')
                .where('foo', 'bar')
                .all()

            // /posts?filter[published]=&filter[foo]=bar
            expect(url).toBe('/posts?filter%5Bpublished%5D=&filter%5Bfoo%5D=bar')
            expect(method).toBe(HttpMethod.GET)
        })
    })

    describe('orderBy', () => {
        test('generates fetch resources request config with ascending sorts by default', async () => {
            const { url, method } = await new Api('posts')
                .orderBy('published_at')
                .all()

            expect(url).toBe('/posts?sort=published_at')
            expect(method).toBe(HttpMethod.GET)
        })

        test('can pass sort direction', async () => {
            const { url, method } = await new Api('posts')
                .orderBy('published_at', SortDirection.DESC)
                .all()

            expect(url).toBe('/posts?sort=-published_at')
            expect(method).toBe(HttpMethod.GET)
        })

        test('can chain', async () => {
            const { url, method } = await new Api('posts')
                .orderBy('published_at', SortDirection.DESC)
                .orderBy('likes_count')
                .all()

            expect(url).toBe('/posts?sort=-published_at%2Clikes_count')
            expect(method).toBe(HttpMethod.GET)
        })
    })

    describe('orderByDesc', () => {
        test('generates fetch resources request config with descending sorts by default', async () => {
            const { url, method } = await new Api('posts')
                .orderByDesc('published_at')
                .all()

            expect(url).toBe('/posts?sort=-published_at')
            expect(method).toBe(HttpMethod.GET)
        })

        test('can chain', async () => {
            const { url, method } = await new Api('posts')
                .orderByDesc('published_at')
                .orderByDesc('likes_count')
                .all()

            expect(url).toBe('/posts?sort=-published_at%2C-likes_count')
            expect(method).toBe(HttpMethod.GET)
        })
    })

    describe('config', () => {
        test('can config query parameter names', async () => {
            const config = new QueryConfig('with', 'without', 'where', 'order')

            const { url, method } = await new Api('posts', config)
                .with('author')
                .without('tags')
                .where('company', 'spacex')
                .orderBy('published_at')
                .all()

            // /posts?with=author&without=tags&where[company]=spacex&order=published_at
            expect(url).toBe('/posts?with=author&without=tags&where%5Bcompany%5D=spacex&order=published_at')
            expect(method).toBe(HttpMethod.GET)
        })
    })
})
