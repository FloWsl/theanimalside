/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			/* Award-Winning Rich Earth-Tone Color System */
  			'deep-forest': '#1a2e1a',
  			'charcoal-forest': '#0f1a0f',
  			'rich-earth': '#8B4513',
  			'deep-earth': '#704010',
  			'warm-sunset': '#D2691E',
  			'burnt-orange': '#CC5500',
  			'golden-hour': '#DAA520',
  			'sage-green': '#87A96B',
  			'warm-beige': '#F5E8D4',
  			'soft-cream': '#F8F3E9',
  			'pure-cream': '#FFFEF9',
  			'gentle-lemon': '#FCF59E',
  			
  			/* Legacy compatibility colors */
  			cream: '#F8F3E9',
  			forest: '#2c392c',
  			earth: '#8B4513',
  			
  			/* Tailwind System Colors */
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': '#fdf6e9',
  				'100': '#f5e8d4',
  				'200': '#edd4aa',
  				'300': '#e5bf80',
  				'400': '#ddaa56',
  				'500': '#d4952c',
  				'600': '#aa7823',
  				'700': '#805a1a',
  				'800': '#553c11',
  				'900': '#2b1e09',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#f3f4f2',
  				'100': '#e7e9e5',
  				'200': '#cfd3cc',
  				'300': '#b7bdb2',
  				'400': '#9fa798',
  				'500': '#87917e',
  				'600': '#6c7465',
  				'700': '#51574c',
  				'800': '#363a32',
  				'900': '#1b1d19',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				'50': '#fdf3eb',
  				'100': '#fbe8d7',
  				'200': '#f7d0af',
  				'300': '#f3b987',
  				'400': '#efa15f',
  				'500': '#e28743',
  				'600': '#b56c35',
  				'700': '#885128',
  				'800': '#5a361b',
  				'900': '#2d1b0d',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			success: {
  				'50': '#ecf6ec',
  				'100': '#d8edd9',
  				'200': '#b2dbb3',
  				'300': '#8bc98d',
  				'400': '#65b768',
  				'500': '#4a9a4d',
  				'600': '#3b7b3e',
  				'700': '#2c5c2e',
  				'800': '#1e3e1f',
  				'900': '#0f1f0f'
  			},
  			warning: {
  				'50': '#fef7ec',
  				'100': '#fdefd9',
  				'200': '#fbdfb3',
  				'300': '#f9cf8d',
  				'400': '#f7bf67',
  				'500': '#f5af41',
  				'600': '#c48c34',
  				'700': '#936927',
  				'800': '#62461a',
  				'900': '#31230d'
  			},
  			error: {
  				'50': '#fdeeee',
  				'100': '#fbdddd',
  				'200': '#f7bbbb',
  				'300': '#f39999',
  				'400': '#ef7777',
  				'500': '#eb5555',
  				'600': '#bc4444',
  				'700': '#8d3333',
  				'800': '#5e2222',
  				'900': '#2f1111'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			display: [
  				'Playfair Display',
  				'serif'
  			],
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'Playfair Display',
  				'Georgia',
  				'Times New Roman',
  				'serif'
  			],
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			// Enhanced typography scale for award-winning design
  			'xs': ['0.75rem', { lineHeight: '1.4' }],
  			'sm': ['0.875rem', { lineHeight: '1.5' }],
  			'base': ['1rem', { lineHeight: '1.7' }],
  			'lg': ['1.125rem', { lineHeight: '1.75' }],
  			'xl': ['1.25rem', { lineHeight: '1.6' }],
  			'2xl': ['1.5rem', { lineHeight: '1.5' }],
  			'3xl': ['1.875rem', { lineHeight: '1.4' }],
  			'4xl': ['2.25rem', { lineHeight: '1.3' }],
  			'5xl': ['3rem', { lineHeight: '1.2' }],
  			'6xl': ['3.75rem', { lineHeight: '1.1' }],
  			'7xl': ['4.5rem', { lineHeight: '1' }],
  			'8xl': ['6rem', { lineHeight: '0.9' }],
  			'9xl': ['8rem', { lineHeight: '0.85' }],
  			// Custom display sizes
  			'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.85' }],
  			'section': ['clamp(2.25rem, 6vw, 6rem)', { lineHeight: '1.1' }],
  			'feature': ['clamp(1.875rem, 5vw, 5rem)', { lineHeight: '1.15' }]
  		},
  		letterSpacing: {
  			'tighter': '-0.03em',
  			'tight': '-0.02em',
  			'normal': '0',
  			'wide': '0.02em',
  			'wider': '0.05em',
  			'widest': '0.1em'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.5s ease-out',
  			float: 'float 6s ease-in-out infinite',
  			'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
  			'pulse-soft': 'pulseSoft 4s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0) rotate(0deg)'
  				},
  				'25%': {
  					transform: 'translateY(-10px) rotate(-2deg)'
  				},
  				'50%': {
  					transform: 'translateY(-15px) rotate(0deg)'
  				},
  				'75%': {
  					transform: 'translateY(-5px) rotate(2deg)'
  				}
  			},
  			bounceGentle: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			pulseSoft: {
  				'0%, 100%': {
  					opacity: '0.6',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					opacity: '0.8',
  					transform: 'scale(1.05)'
  				}
  			}
  		},
  		backgroundImage: {
  			texture: 'url("https://images.pexels.com/photos/7919/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
};