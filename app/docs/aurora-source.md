# Aurora background — upstream source

The demo at [shadcn.io/background/aurora](https://www.shadcn.io/background/aurora) ships the **uibrik** Aurora block, not a file in the main `shadcn-ui/ui` GitHub repo.

## Install manifest (full source in JSON)

- **Registry URL:** https://uibrik.com/r/aurora.json  
- **Component docs:** https://uibrik.com/components/aurora  
- **Registry listing:** https://registry.directory/uibrik/aurora  

## Files inside the registry bundle

| Registry path | Role |
|---------------|------|
| `registry/aurora/aurora.tsx` | Curtain GLSL + `ShaderSurface` wiring |
| `registry/_shader-background/ShaderSurface.tsx` | WebGL2 canvas, animation loop, uniforms |
| `registry/aurora/first-frame.ts` | **CPU copy of the same shader** (used as CSS fallback) |

There is **no public GitHub tree** for uibrik — you install with:

```bash
npx shadcn@latest add https://uibrik.com/r/aurora.json
```

## Related open-source (different implementation)

DavidHDev’s Aurora (WebGL2, similar curtain metaphor):

- https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Aurora/Aurora.jsx

## Spot native port

`app/lib/aurora/uibrikCpu.ts` ports `first-frame.ts` for React Native (`expo-image` + animated BMP). Same noise/curtain math as the WebGL version on the site.