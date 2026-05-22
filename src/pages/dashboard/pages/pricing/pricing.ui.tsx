import { useEffect, useMemo } from 'react';
import {
  Badge,
  Box,
  Button as MantineButton,
  Flex,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import {
  HiCheckCircle,
  HiLightningBolt,
  HiOutlineXCircle,
  HiShieldCheck,
  HiSparkles,
} from 'react-icons/hi';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import { resolveActivePricingPlanId } from '@/shared/lib/premiumTier';
import {
  openTelegramHelp,
  openTelegramPremium,
} from '@/shared/lib/telegramNavigation';
import { PLANS, type Feature, type Plan, type PlanColor } from './pricing.const';
import styles from './pricing.module.css';

/* ------------------------------------------------------------------ */
/*  Feature row                                                          */
/* ------------------------------------------------------------------ */
function FeatureRow({ text, included }: Feature) {
  return (
    <List.Item
      icon={
        <ThemeIcon
          size={18}
          radius="xl"
          variant="transparent"
          color={included ? 'green' : 'gray'}
          style={{ marginTop: 1 }}
        >
          {included ? <HiCheckCircle size={18} /> : <HiOutlineXCircle size={18} />}
        </ThemeIcon>
      }
    >
      <Text
        size="sm"
        c={included ? undefined : 'dimmed'}
        style={{ textDecoration: included ? 'none' : 'line-through' }}
      >
        {text}
      </Text>
    </List.Item>
  );
}

/* ------------------------------------------------------------------ */
/*  Plan card                                                            */
/* ------------------------------------------------------------------ */
function planIconColor(color: PlanColor): PlanColor {
  return color === 'gray' ? 'gray' : 'green';
}

function PlanCard({ plan, current }: { plan: Plan; current: boolean }) {
  const isFree = plan.id === 'free';
  const ctaLabel = current ? 'Hozirgi tarif' : plan.cta;
  const accent: PlanColor = planIconColor(plan.color);

  return (
    <Box className={plan.badge ? styles.planCardWrap : undefined} style={{ height: '100%' }}>
      {plan.badge && (
        <Badge
          className={styles.planTopBadge}
          variant="filled"
          color="green"
          radius="xl"
        >
          {plan.badge}
        </Badge>
      )}

      <Paper
        radius="xl"
        p="xl"
        withBorder
        shadow="sm"
        bg="var(--mantine-color-body)"
        className={[
          styles.planCard,
          plan.highlight ? styles.planCardHighlight : '',
          current ? styles.planCardCurrent : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {current && (
          <Badge
            pos="absolute"
            top={12}
            right={12}
            variant="filled"
            color="green"
            radius="md"
            size="sm"
            style={{ zIndex: 2, fontWeight: 700 }}
          >
            Hozirgi
          </Badge>
        )}

      {/* Header */}
      <Flex align="center" gap="sm" mb="xs" pr={current ? 72 : 0}>
        <ThemeIcon
          size={38}
          radius="xl"
          variant="light"
          color={accent}
          style={{ flexShrink: 0 }}
        >
          {plan.icon}
        </ThemeIcon>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} fz={18} lh={1.2} lineClamp={2}>
            {plan.name}
          </Text>
          {plan.period && (
            <Text size="xs" c="dimmed">
              {plan.period}
            </Text>
          )}
        </Box>
      </Flex>

      {/* Price */}
      <Box mb="xs">
        <Text
          fw={800}
          fz={isFree ? 28 : 20}
          c={isFree ? 'dimmed' : undefined}
          lh={1.1}
        >
          {plan.price}
        </Text>
      </Box>

      {/* Slogan */}
      <Text size="sm" c="dimmed" mb="lg" mih={36}>
        {plan.slogan}
      </Text>

      {/* Features */}
      <List spacing="xs" style={{ flex: 1, marginBottom: 0 }}>
        {plan.features.map((f) => (
          <FeatureRow key={f.text} {...f} />
        ))}
      </List>

      {/* CTA — barcha kartalarda bir xil balandlik, bir chiziqda */}
      <Box mt="auto" pt="lg" style={{ flexShrink: 0 }}>
        {isFree ? (
          <Box
            ta="center"
            className={`${styles.freeCta} ${
              current ? styles.freeCtaCurrent : styles.freeCtaInactive
            }`}
          >
            <Text
              size="sm"
              fw={600}
              c={current ? 'green.7' : 'dimmed'}
              style={
                current ? undefined : { color: 'var(--mantine-color-dimmed)' }
              }
            >
              {ctaLabel}
            </Text>
          </Box>
        ) : (
          <MantineButton
            type="button"
            fullWidth
            radius="lg"
            disabled={current}
            variant={current ? 'light' : 'filled'}
            color="green"
            classNames={{
              root: [
                styles.planCta,
                current ? styles.planCtaCurrent : '',
              ]
                .filter(Boolean)
                .join(' '),
            }}
            onClick={(e) => {
              if (!current) openTelegramPremium(e);
            }}
          >
            {ctaLabel}
          </MantineButton>
        )}
      </Box>
      </Paper>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  USP badges under header                                              */
/* ------------------------------------------------------------------ */
function UspsRow() {
  const items = [
    {
      icon: <HiShieldCheck size={16} />,
      text: 'Istalgan vaqt bekor qilish',
    },
    { icon: <HiLightningBolt size={16} />, text: 'Darhol faollashtirish' },
    {
      icon: <HiSparkles size={16} />,
      text: 'AI bilan agro-biznesingizni o\u02BBstiring',
    },
  ];
  return (
    <Flex wrap="wrap" justify="center" gap="md" mb={40}>
      {items.map((i) => (
        <Flex
          key={i.text}
          align="center"
          gap={6}
          px="md"
          py={6}
          style={{
            borderRadius: 999,
            background: 'var(--mantine-color-default-hover)',
            border: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Box c="green">{i.icon}</Box>
          <Text size="xs" fw={500}>
            {i.text}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

/* ------------------------------------------------------------------ */
/*  Kontent oxiridagi ishonch qatori                                     */
/* ------------------------------------------------------------------ */
function PricingTrustFooter() {
  return (
    <Flex
      className={styles.trustFooter}
      align="center"
      justify="center"
      gap="xs"
      wrap="wrap"
    >
      <HiShieldCheck size={16} color="#22c55e" style={{ flexShrink: 0 }} />
      <Text size="xs" c="dimmed" ta="center" maw={520}>
        To'lovlar xavfsiz. Istalgan vaqt bekor qilish mumkin. Savol bo'lsa -{' '}
        <Text
          component="button"
          type="button"
          size="xs"
          c="green"
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
          }}
          onClick={openTelegramHelp}
        >
          biz bilan bog'laning
        </Text>
        .
      </Text>
    </Flex>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                            */
/* ------------------------------------------------------------------ */
export function PricingView() {
  const opened = usePricingModalStore((s) => s.opened);
  const hydrated = useAuthStoreHydrated();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateUser = useAuthStore((s) => s.updateUser);
  const isMobile = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    if (!opened || !hydrated || !isAuthenticated || !accessToken) return;

    let cancelled = false;

    const syncMe = async () => {
      try {
        const me = await getAuthMe();
        if (!cancelled) updateUser(mapAuthMeToUser(me));
      } catch {
        /* store dagi ma'lumot qoladi */
      }
    };

    void syncMe();

    return () => {
      cancelled = true;
    };
  }, [opened, hydrated, isAuthenticated, accessToken, updateUser]);

  useEffect(() => {
    if (!opened || !hydrated || !isAuthenticated || !accessToken) return;

    let cancelled = false;

    const syncOnReturn = () => {
      if (document.visibilityState !== 'visible') return;
      void getAuthMe()
        .then((me) => {
          if (!cancelled) updateUser(mapAuthMeToUser(me));
        })
        .catch(() => {
          /* joriy store qoladi */
        });
    };

    document.addEventListener('visibilitychange', syncOnReturn);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', syncOnReturn);
    };
  }, [opened, hydrated, isAuthenticated, accessToken, updateUser]);

  const currentTier = resolveActivePricingPlanId(user);

  const visiblePlans = useMemo(
    () => (isMobile ? PLANS.filter((plan) => plan.id !== 'free') : PLANS),
    [isMobile]
  );

  return (
    <Box
      className={styles.page}
      maw={1200}
      mx="auto"
      px={{ base: 0, sm: 'md' }}
    >
      <Box className={styles.pageContent}>
        <Stack gap="md">
        {/* Hero text */}
        <Stack align="center" gap={8} mb="md">
          <Badge
            size="lg"
            variant="light"
            color="green"
            radius="xl"
            leftSection={<HiSparkles size={14} />}
          >
            Agrofy Premium
          </Badge>
          <Title
            order={1}
            ta="center"
            fz={{ base: 26, sm: 36 }}
            fw={800}
            lh={1.15}
          >
            O'z biznesingizni keyingi bosqichga olib chiqing
          </Title>
          <Text ta="center" c="dimmed" maw={560} fz="md">
            Agro AI, marketplace va xizmatlar - bir platformada. Tarifingizni
            tanlang va imkoniyatlarni to'liq oching.
          </Text>
        </Stack>

        <UspsRow />

        {/* Cards grid */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(auto-fill, minmax(280px, 1fr))'
              : 'repeat(4, 1fr)',
            gap: 20,
            alignItems: 'stretch',
            overflow: 'visible',
            paddingTop: 4,
          }}
        >
          {visiblePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={plan.id === currentTier}
            />
          ))}
        </Box>
        </Stack>
      </Box>

      <PricingTrustFooter />
    </Box>
  );
}
