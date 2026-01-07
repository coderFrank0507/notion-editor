import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const TaskItemChecked = memo(({ className, ...props }: SvgProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 16 16"
			className={className}
			{...props}
		>
			<path
				d="M11.62 3.18a.876.876 0 0 1 1.5.9l-5.244 8.74a.876.876 0 0 1-1.414.12L2.966 8.86a.875.875 0 1 1 1.328-1.138L7 10.879z"
				fill="currentColor"
			/>
		</svg>
	);
});

TaskItemChecked.displayName = "TaskItemChecked";
