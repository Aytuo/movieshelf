import { redirect } from 'next/navigation';

const FavoritesPage = () => {
  redirect('/shelf?filter=favorites');

  return (
    <section className="container-content py-16">
      <h1 className="font-heading text-4xl font-bold tracking-tight">
        Favorites
      </h1>

      <p className="mt-3 text-muted-foreground">
        Movies that deserve a special place on your shelf.
      </p>
    </section>
  );
};

export default FavoritesPage;
