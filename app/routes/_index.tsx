import { Icon } from '@iconify/react'
import type { MetaFunction } from '@remix-run/node'
import { useState } from 'react'
import { tv } from 'tailwind-variants'
import { type InferType, number, object, string } from 'yup'
import { clsx } from 'clsx'
import { useMask } from '@react-input/mask'
import { NumericFormat } from 'react-number-format'
import { nanoid } from 'nanoid'
import * as htmlToImage from 'html-to-image'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Vakinha Donation Simulator' },
		{ name: 'description', content: 'Vakinha Donation Simulator' },
	]
}

const label = tv({
	base: 'text-gray-500 font-light text-sm mb-1',
})

const button = tv({
	base: 'rounded-lg border px-3 py-1.5 text-center text-sm font-medium text-white shadow-sm transition-all disabled:cursor-not-allowed',
	variants: {
		variant: {
			filled: '',
			outline: '',
		},
		color: {
			primary:
				'border-blue-500 bg-blue-500 hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300',
			red: 'border-red-500 bg-red-500 hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300',
		},
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg px-6 py-3',
		},
		full: {
			true: 'w-full',
		},
	},
	compoundVariants: [
		{
			variant: 'outline',
			color: 'primary',
			class:
				'bg-transparent text-blue-500 hover:text-blue-400 focus:ring focus:ring-blue-200 hover:bg-transparent hover:border-blue-400',
		},
		{
			variant: 'outline',
			color: 'red',
			class:
				'bg-transparent text-red-600 hover:text-red-500 focus:ring focus:ring-red-200 hover:bg-transparent hover:border-red-400',
		},
	],
	defaultVariants: {
		color: 'primary',
		size: 'md',
	},
})

const input = tv({
	base: 'w-full border border-gray-300 rounded-md px-2 py-1 text-sm',
})

const input_wrapper = tv({
	base: '[&:not(:last-child)]:mb-2',
})

const Configuration = object({
	value: number().nullable(),
	doc_type: string()
		.oneOf(['cnpj', 'cpf'] as const)
		.required(),
	date: string().required(),
	doc: string().required(),
	destiny: string().required(),
})

type Configuration = InferType<typeof Configuration>

function Configurator({
	values,
	onChange,
}: {
	values: Configuration
	onChange: (values: Configuration) => void
}) {
	const [is_open, set_is_open] = useState(false)

	const doc_input_ref = useMask({
		mask: values.doc_type === 'cpf' ? '___.___.___-__' : '__.___.___/____-__',
		replacement: { _: /\d/ },
	})

	const date_time_input_ref = useMask({
		mask: '__/__/____ __:__',
		replacement: { _: /\d/ },
	})

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = event.target
		onChange({
			...values,
			[name]: value,
			...(name === 'doc_type' ? { doc: '' } : {}),
		})
	}

	return (
		<div
			className={clsx(
				'fixed top-4 md:right-4 bg-white border border-gray-300 rounded-md p-4 w-[200px]',
				'transition-[left]',
				'data-[is-open=false]:left-full',
				'data-[is-open=true]:left-[calc(100%-200px)]',
			)}
			data-is-open={is_open}
		>
			<button
				type="button"
				className="bg-white border-b border-t border-l border-gray-300 rounded-l-md p-2 absolute top-4 -left-9 size-9 flex flex-row items-center justify-center cursor-pointer"
				onClick={() => set_is_open(!is_open)}
			>
				<Icon icon="material-symbols:settings" />
			</button>
			<div className={input_wrapper()}>
				<label htmlFor="value" className={label()}>
					Valor
				</label>
				<NumericFormat
					decimalSeparator=","
					decimalScale={2}
					thousandSeparator="."
					name="value"
					id="value"
					className={input()}
					value={values.value}
					onValueChange={({ floatValue: float_value }) => {
						return onChange({ ...values, value: float_value })
					}}
				/>
			</div>
			<div className={input_wrapper()}>
				<label htmlFor="doc_type" className={label()}>
					Tipo de Documento
				</label>
				<select
					name="doc_type"
					id="doc_type"
					className={input()}
					value={values.doc_type}
					onChange={handleChange}
				>
					<option value="cnpj">CNPJ</option>/<option value="cpf">CPF</option>
				</select>
			</div>
			<div className={input_wrapper()}>
				<label htmlFor="doc" className={label()}>
					Documento
				</label>
				<input
					ref={doc_input_ref}
					type="text"
					name="doc"
					id="doc"
					onChange={handleChange}
					className={input()}
					value={values.doc}
				/>
			</div>
			<div className={input_wrapper()}>
				<label htmlFor="destiny" className={label()}>
					Para
				</label>
				<input
					onChange={handleChange}
					type="text"
					name="destiny"
					id="destiny"
					className={input()}
					value={values.destiny}
				/>
			</div>
			<div className={input_wrapper()}>
				<label htmlFor="doc" className={label()}>
					Data e hora da transação
				</label>
				<input
					ref={date_time_input_ref}
					type="text"
					name="doc"
					id="doc"
					onChange={handleChange}
					className={input()}
					value={values.doc}
				/>
			</div>
			<button
				type="button"
				className={button({ size: 'sm', full: true })}
				onClick={() =>
					htmlToImage
						.toPng(document.querySelector('#receipt') as HTMLDivElement)
						.then((image) => window.open(image))
				}
			>
				Download
			</button>
			<div className="flex flex-row gap-2 text-green-600 mt-4 items-center justify-center text-xl">
				<a
					href="https://twitter.com/original_bop"
					target="_blank"
					rel="noreferrer"
				>
					<Icon icon="bxl:twitter" />
				</a>
				<a
					href="https://instagram.com/bruno.dev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon icon="bxl:instagram" />
				</a>
				<a
					href="https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/"
					target="_blank"
					rel="noreferrer"
				>
					<Icon icon="bxl:linkedin" />
				</a>
			</div>
			<div className="text-blue-600 mt-4 items-center justify-center text-xs text-center">
				Made by{' '}
				<a
					href="https://bop.systems"
					target="_blank"
					rel="noreferrer"
					className="underline font-bold"
				>
					bop
				</a>
				, with ❤. All rights reserved.
			</div>
		</div>
	)
}

export default function Index() {
	const [id] = useState<string>(() => nanoid(40).toUpperCase())
	const [values, set_values] = useState<Configuration>({
		value: 100.0,
		date: '01/06/2024 22:00',
		doc_type: 'cnpj',
		doc: '85.324.829/0001-00',
		destiny: 'Vakinha',
	})

	return (
		<div className="w-screen h-full min-h-screen flex flex-col items-center bg-gray-100">
			<div
				className="md:w-[540px] w-full min-h-screen bg-white relative flex-col flex justify-between"
				id="receipt"
			>
				<div>
					<div className="font-sans w-full h-16 bg-red-600 text-white flex flex-row items-center px-6 mb-2">
						<h1 className="text-3xl w-16">
							<Icon icon="material-symbols:close" />
						</h1>
						<p className="text-xl text-center w-full">Comprovante</p>
						<div className="size-16" />
					</div>
					<div className="w-full p-6 flex flex-col gap-6">
						<div className="w-full p-6 border border-gray-200 rounded-md text-gray-500 flex items-center gap-4">
							<Icon
								icon="material-symbols:check-circle"
								className="text-lime-600 text-xl"
							/>
							<div>Pronto! Seu pagamento foi realizado com sucesso!</div>
						</div>
						<div className="w-full ">
							<div className="w-full text-gray-400 font-light">Valor pago</div>
							<div className="w-full text-slate-900 font-bold text-xl">
								{new Intl.NumberFormat('pt-BR', {
									currency: 'BRL',
									style: 'currency',
									maximumFractionDigits: 2,
									minimumFractionDigits: 2,
								}).format(values.value ?? 0)}
							</div>
						</div>
						<div className="w-full ">
							<div className="w-full text-gray-400">Para</div>
							<div className="w-full text-slate-900">{values.destiny}</div>
						</div>
						<div className="w-full ">
							<div className="w-full text-gray-400">
								{values.doc_type.toUpperCase()}
							</div>
							<div className="w-full text-slate-900">{values.doc}</div>
						</div>
						<div className="w-full">
							<div className="w-full text-gray-400">
								Data e hora da transação
							</div>
							<div className="w-full text-slate-900">{values.date}</div>
						</div>
						<div className="w-full">
							<div className="w-full text-gray-400">Código de Autenticação</div>
							<div className="w-full text-slate-900">{id}</div>
						</div>
						<div className="w-full h-[1px] bg-gray-200" />
					</div>
				</div>
				<div className="px-6 pb-6">
					<button
						type="button"
						className={clsx(
							button({
								color: 'red',
								size: 'lg',
								full: true,
								variant: 'outline',
							}),
						)}
					>
						Salvar ou Compartilhar
					</button>
				</div>
			</div>
			<Configurator values={values} onChange={set_values} />
		</div>
	)
}
