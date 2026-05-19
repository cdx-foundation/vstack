interface BackgroundProps {
  isLoading: boolean;
}

export function Background(props: BackgroundProps) {
  return (
    <div
      class="fixed inset-0 bg-overlay pointer-events-none transition-opacity duration-700"
      classList={{ 'bg-dev-mockup': import.meta.env.DEV }}
      style={{
        opacity: props.isLoading ? '0' : '1',
      }}
    >
      <div class="absolute inset-0 bg-(--bg-overlay) backdrop-blur-sm" />
    </div>
  );
}
