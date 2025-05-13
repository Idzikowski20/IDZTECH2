
// Schema for Sanity.io CMS

export default {
  name: 'default',
  title: 'IDZ.Tech CMS',
  types: [
    // User type - używany do przechowywania danych użytkowników
    {
      name: 'user',
      title: 'Użytkownik',
      type: 'document',
      fields: [
        {
          name: 'name',
          title: 'Imię',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'lastName',
          title: 'Nazwisko',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.required().email()
        },
        {
          name: 'profilePicture',
          title: 'Zdjęcie profilowe',
          type: 'image',
          options: {
            hotspot: true
          }
        },
        {
          name: 'role',
          title: 'Rola',
          type: 'string',
          options: {
            list: [
              { title: 'Użytkownik', value: 'user' },
              { title: 'Moderator', value: 'moderator' },
              { title: 'Bloger', value: 'blogger' },
              { title: 'Administrator', value: 'admin' }
            ]
          },
          initialValue: 'user'
        },
        {
          name: 'jobTitle',
          title: 'Stanowisko',
          type: 'string'
        },
        {
          name: 'bio',
          title: 'Biografia',
          type: 'text'
        },
        {
          name: 'stats',
          title: 'Statystyki',
          type: 'object',
          fields: [
            { name: 'views', title: 'Wyświetlenia', type: 'number', initialValue: 0 },
            { name: 'posts', title: 'Posty', type: 'number', initialValue: 0 },
            { name: 'comments', title: 'Komentarze', type: 'number', initialValue: 0 },
            { name: 'likes', title: 'Polubienia', type: 'number', initialValue: 0 },
            { name: 'pointsTotal', title: 'Punkty całkowite', type: 'number', initialValue: 0 },
            { name: 'pointsThisMonth', title: 'Punkty w tym miesiącu', type: 'number', initialValue: 0 },
            { name: 'lastUpdated', title: 'Ostatnia aktualizacja', type: 'datetime' }
          ]
        },
        {
          name: 'created_at',
          title: 'Data utworzenia',
          type: 'datetime',
          readOnly: true
        },
        {
          name: 'last_sign_in',
          title: 'Ostatnie logowanie',
          type: 'datetime'
        }
      ],
      preview: {
        select: {
          title: 'name',
          subtitle: 'email',
          media: 'profilePicture'
        }
      }
    },
    
    // Blog post type - używany do przechowywania postów na blogu
    {
      name: 'blogPost',
      title: 'Post Blogowy',
      type: 'document',
      fields: [
        {
          name: 'title',
          title: 'Tytuł',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: { source: 'title' },
          validation: Rule => Rule.required()
        },
        {
          name: 'author',
          title: 'Autor',
          type: 'reference',
          to: [{ type: 'user' }]
        },
        {
          name: 'excerpt',
          title: 'Zajawka',
          type: 'text',
          validation: Rule => Rule.required()
        },
        {
          name: 'mainImage',
          title: 'Zdjęcie główne',
          type: 'image',
          options: { hotspot: true },
          validation: Rule => Rule.required()
        },
        {
          name: 'categories',
          title: 'Kategorie',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'tags',
          title: 'Tagi',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'publishedAt',
          title: 'Data publikacji',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'content',
          title: 'Treść',
          type: 'array',
          of: [
            {
              type: 'block'
            },
            {
              type: 'image',
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Tekst alternatywny',
                }
              ]
            },
            {
              type: 'code',
              title: 'Kod',
              options: {
                language: 'javascript'
              }
            }
          ]
        },
        {
          name: 'views',
          title: 'Wyświetlenia',
          type: 'number',
          initialValue: 0
        },
        {
          name: 'likes',
          title: 'Polubienia',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'user' }] }]
        },
        {
          name: 'comments',
          title: 'Komentarze',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'author',
                  title: 'Autor',
                  type: 'reference',
                  to: [{ type: 'user' }]
                },
                {
                  name: 'text',
                  title: 'Tekst',
                  type: 'text'
                },
                {
                  name: 'postedAt',
                  title: 'Data dodania',
                  type: 'datetime'
                }
              ]
            }
          ]
        }
      ],
      preview: {
        select: {
          title: 'title',
          subtitle: 'excerpt',
          media: 'mainImage'
        }
      }
    },
    
    // Page content type - używany do przechowywania treści stron
    {
      name: 'page',
      title: 'Strona',
      type: 'document',
      fields: [
        {
          name: 'title',
          title: 'Tytuł',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: { source: 'title' },
          validation: Rule => Rule.required()
        },
        {
          name: 'content',
          title: 'Treść',
          type: 'array',
          of: [
            {
              type: 'block'
            },
            {
              type: 'image',
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Tekst alternatywny',
                }
              ]
            }
          ]
        },
        {
          name: 'sections',
          title: 'Sekcje',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'hero',
              title: 'Hero',
              fields: [
                {
                  name: 'heading',
                  title: 'Nagłówek',
                  type: 'string'
                },
                {
                  name: 'subheading',
                  title: 'Podtytuł',
                  type: 'text'
                },
                {
                  name: 'bgImage',
                  title: 'Zdjęcie tła',
                  type: 'image',
                  options: { hotspot: true }
                },
                {
                  name: 'ctaText',
                  title: 'Tekst przycisku CTA',
                  type: 'string'
                },
                {
                  name: 'ctaUrl',
                  title: 'URL przycisku CTA',
                  type: 'string'
                }
              ]
            },
            {
              type: 'object',
              name: 'textWithImage',
              title: 'Tekst ze zdjęciem',
              fields: [
                {
                  name: 'heading',
                  title: 'Nagłówek',
                  type: 'string'
                },
                {
                  name: 'text',
                  title: 'Tekst',
                  type: 'array',
                  of: [{ type: 'block' }]
                },
                {
                  name: 'image',
                  title: 'Zdjęcie',
                  type: 'image',
                  options: { hotspot: true }
                },
                {
                  name: 'imagePosition',
                  title: 'Pozycja zdjęcia',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Lewo', value: 'left' },
                      { title: 'Prawo', value: 'right' }
                    ]
                  },
                  initialValue: 'right'
                }
              ]
            },
            {
              type: 'object',
              name: 'services',
              title: 'Usługi',
              fields: [
                {
                  name: 'heading',
                  title: 'Nagłówek',
                  type: 'string'
                },
                {
                  name: 'services',
                  title: 'Usługi',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'title',
                          title: 'Tytuł',
                          type: 'string'
                        },
                        {
                          name: 'description',
                          title: 'Opis',
                          type: 'text'
                        },
                        {
                          name: 'icon',
                          title: 'Ikona',
                          type: 'string'
                        },
                        {
                          name: 'url',
                          title: 'URL',
                          type: 'string'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'seo',
          title: 'SEO',
          type: 'object',
          fields: [
            {
              name: 'metaTitle',
              title: 'Meta tytuł',
              type: 'string'
            },
            {
              name: 'metaDescription',
              title: 'Meta opis',
              type: 'text'
            },
            {
              name: 'ogImage',
              title: 'Open Graph Image',
              type: 'image',
              options: { hotspot: true }
            }
          ]
        }
      ],
      preview: {
        select: {
          title: 'title',
          subtitle: 'slug.current'
        }
      }
    }
  ]
};
